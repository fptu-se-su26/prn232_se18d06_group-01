using JLearn.DTOs.Quiz;

namespace JLearn.Services.Interfaces;

public interface IQuizService
{
    Task<List<QuizQuestionDto>> GetQuizByLessonAsync(int lessonId);
    Task<QuizResultDto> SubmitQuizAsync(int userId, QuizSubmitDto dto);

    Task<QuizQuestionDto> CreateQuestionAsync(QuizQuestionCreateDto dto);
    Task<QuizQuestionDto> UpdateQuestionAsync(int questionId, QuizQuestionUpdateDto dto);
    Task<bool> DeleteQuestionAsync(int questionId);
}