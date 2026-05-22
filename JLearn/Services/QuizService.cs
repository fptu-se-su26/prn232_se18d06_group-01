using JLearn.DTOs.Quiz;
using JLearn.Models;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace JLearn.Services;

public class QuizService : IQuizService
{
    
    private readonly IUnitOfWork _unitOfWork;
    
    public QuizService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    
    public async Task<List<QuizQuestionDto>> GetQuizByLessonAsync(int lessonId)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(lessonId);
        if (lesson == null)
        {
            throw new KeyNotFoundException("Khong tim thay bai hoc");
        }

        var questions = await _unitOfWork.Questions.Query()
            .Where(q => q.LessonId == lessonId)
            .Select(q => new QuizQuestionDto
            {
                QuestionId = q.QuestionId,
                Content = q.Content,
                OptionA = q.OptionA,
                OptionB = q.OptionB,
                OptionC = q.OptionC,
                OptionD = q.OptionD

            })
            .ToListAsync();
        var rng = new Random();
        return questions.OrderBy(_ => rng.Next()).ToList();
}

    public async Task<QuizResultDto> SubmitQuizAsync(int userId, QuizSubmitDto dto)
    {
        var dbQuestions = await _unitOfWork.Questions.Query()
            .Where(q => q.LessonId == dto.LessonId)
            .ToListAsync();
        if (!dbQuestions.Any())
        {
            throw new KeyNotFoundException("Khong tim cau hoi cho bai hoc nay");
        }

        int totalQuestions = dbQuestions.Count;
        int correctCount = 0;
        var details = new List<QuizResultDetailDto>();

        // Duyệt qua từng câu hỏi trong DB để chấm điểm
        foreach (var dbQ in dbQuestions)
        {
            // Tìm câu trả lời của học viên cho câu hỏi này
            var userAnswer = dto.Answer?.FirstOrDefault(a => a.QuestionId == dbQ.QuestionId);
            string selected = userAnswer?.UserAnswer?.Trim().ToUpper() ?? string.Empty;

            // So sánh đáp án học viên với đáp án đúng trong DB
            bool isCorrect = selected == dbQ.CorrectAnswer.Trim().ToUpper();
            if (isCorrect) correctCount++;

            details.Add(new QuizResultDetailDto
            {
                QuestionId = dbQ.QuestionId,
                QuestionText = dbQ.Content,
                UserAnswer = selected,
                CorrectAnswer = dbQ.CorrectAnswer,
                IsCorrect = isCorrect
            });
        }

        // Tính tỷ lệ điểm phần trăm
        double scorePercentage = Math.Round(((double)correctCount / totalQuestions) * 100, 2);

        // Lưu kết quả làm bài vào Database
        var quizResult = new QuizResult
        {
            UserId = userId,
            LessonId = dto.LessonId,
            TotalScore = correctCount,
            TotalQuestions = totalQuestions,
            CompletedAt = DateTime.UtcNow
        };

        await _unitOfWork.QuizResults.AddAsync(quizResult);
        await _unitOfWork.SaveChangesAsync();

        return new QuizResultDto
        {
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctCount,
            Score = scorePercentage,
            Details = details
        };
    }
}