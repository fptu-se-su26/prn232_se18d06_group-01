using JLearn.DTOs.Quiz;
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
       // foreach (var dbQ in dbQuestions)
     //   {
     //       if (dto.Answer== dbQ.CorrectAnswer)
      //      {
      //          
     //       }
     //   }
     throw new KeyNotFoundException();
    }
}