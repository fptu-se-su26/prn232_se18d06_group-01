using JLearn.DTOs.Grammar;
using JLearn.DTOs.Lesson;
using JLearn.DTOs.Vocabulary;

namespace JLearn.Services.Interfaces;

public interface ILessonService
{
    Task<List<LessonDto>> GetLessonsByCourseAsync(int courseId);
    Task<LessonDto?> GetLessonByIdAsync(int lessonId);
    Task<List<VocabularyDto>> GetVocabulariesByLessonAsync(int lessonId);
    Task<List<GrammarDto>> GetGrammarsByLessonAsync(int lessonId);
}
