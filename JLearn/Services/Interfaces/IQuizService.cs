using JLearn.DTOs.Quiz;

namespace JLearn.Services.Interfaces;

public interface IQuizService
{
    Task<List<QuizQuestionDto>> GetQuizByLessonAsync(int lessonId);
    Task<QuizResultDto> SubmitQuizAsync(int userId, QuizSubmitDto dto);
}