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

    Task<LessonDto> CreateAsync(LessonCreateDto dto);
    Task<LessonDto> UpdateAsync(int lessonId, LessonUpdateDto dto);
    Task<bool> DeleteAsync(int lessonId);

    Task<VocabularyDto> CreateVocabularyAsync(VocabularyCreateDto dto);
    Task<VocabularyDto> UpdateVocabularyAsync(int vocabId, VocabularyUpdateDto dto);
    Task<bool> DeleteVocabularyAsync(int vocabId);

    Task<GrammarDto> CreateGrammarAsync(GrammarCreateDto dto);
    Task<GrammarDto> UpdateGrammarAsync(int grammarId, GrammarUpdateDto dto);
    Task<bool> DeleteGrammarAsync(int grammarId);
}
