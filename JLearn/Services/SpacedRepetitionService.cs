using JLearn.DTOs.SpacedRepetition;
using JLearn.DTOs.Vocabulary;
using JLearn.Models;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace JLearn.Services;

public class SpacedRepetitionService : ISpacedRepetitionService
{
    private readonly IUnitOfWork _unitOfWork;
    public SpacedRepetitionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<VocabularyDto>> GetDueVocabulariesAsync(int userId)
    {
        var now = DateTime.UtcNow;

        // Tìm các từ vựng đã đến hoặc quá hạn ôn tập (NextReviewDate <= Now)
        var dueVocabs = await _unitOfWork.UserVocabularies.Query()
            .Where(uv => uv.UserId == userId && uv.NextReviewDate <= now)
            .Include(uv => uv.Vocabulary)
            .Select(uv => new VocabularyDto
            {
                VocabId = uv.VocabId,
                Romaji = uv.Vocabulary.Romaji,
                Kanji = uv.Vocabulary.Kanji,
                Hira = uv.Vocabulary.Hira,
                Kana = uv.Vocabulary.Kana,
                Meaning = uv.Vocabulary.Meaning,
                LessonId = uv.Vocabulary.LessonId
            })
            .ToListAsync();

        return dueVocabs;
    }

    public async Task<ReviewResultDto> ProcessReviewAsync(int userId, ReviewRequestDto dto)
    {
        if (dto.Quality < 0 || dto.Quality > 5)
            throw new ArgumentException("Quality phải nằm trong khoảng từ 0 đến 5.");

        // 1. Kiểm tra xem từ vựng có tồn tại không
        var vocab = await _unitOfWork.Vocabularies.GetByIdAsync(dto.VocabularyId);
        if (vocab == null)
            throw new KeyNotFoundException("Không tìm thấy từ vựng.");

        // 2. Tìm bản ghi học tập của User cho từ vựng này
        var userVocab = await _unitOfWork.UserVocabularies.Query()
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.VocabId == dto.VocabularyId);

        // 3. Nếu chưa từng học (chưa có bản ghi), hãy khởi tạo các thông số mặc định ban đầu
        if (userVocab == null)
        {
            userVocab = new UserVocabulary
            {
                UserId = userId,
                VocabId = dto.VocabularyId,
                EaseFactor = 2.5, // Mặc định ban đầu của SM-2
                Repetitions = 0,
                IntervalDays = 0,
                NextReviewDate = DateTime.UtcNow
            };
            await _unitOfWork.UserVocabularies.AddAsync(userVocab);
        }

        // 4. Áp dụng Thuật toán SM-2 để tính toán các chỉ số mới
        double ef = userVocab.EaseFactor;
        int reps = userVocab.Repetitions;
        int interval = userVocab.IntervalDays;
        int q = dto.Quality;

        // A. Tính Ease Factor mới
        ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (ef < 1.3) ef = 1.3; // Giới hạn dưới

        // B. Tính Repetitions và Interval mới
        if (q >= 3)
        {
            reps += 1;
            if (reps == 1)
            {
                interval = 1;
            }
            else if (reps == 2)
            {
                interval = 6;
            }
            else
            {
                interval = (int)Math.Round(interval * ef);
            }
        }
        else
        {
            // Ôn tập thất bại, reset học lại từ đầu
            reps = 0;
            interval = 1;
        }

        // C. Cập nhật các thông số mới vào đối tượng
        userVocab.EaseFactor = ef;
        userVocab.Repetitions = reps;
        userVocab.IntervalDays = interval;
        userVocab.NextReviewDate = DateTime.UtcNow.AddDays(interval);

        _unitOfWork.UserVocabularies.Update(userVocab);
        await _unitOfWork.SaveChangesAsync();

        return new ReviewResultDto
        {
            VocabularyId = vocab.VocabId,
            Word = vocab.Kana,
            NextIntervalDays = interval,
            NextReviewDate = userVocab.NextReviewDate
        };
    }
}