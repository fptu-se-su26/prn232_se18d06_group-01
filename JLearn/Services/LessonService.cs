using JLearn.DTOs.Grammar;
using JLearn.DTOs.Lesson;
using JLearn.DTOs.Vocabulary;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace JLearn.Services;

public class LessonService : ILessonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;

    public LessonService(IUnitOfWork unitOfWork, IMemoryCache cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<List<LessonDto>> GetLessonsByCourseAsync(int courseId)
    {
        var cacheKey = $"lessons_course_{courseId}";

        if (_cache.TryGetValue(cacheKey, out List<LessonDto>? cached) && cached != null)
            return cached;

        var lessons = await _unitOfWork.Lessons.Query()
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.OrderIndex)
            .Select(l => new LessonDto
            {
                LessonId = l.LessonId,
                CourseId = l.CourseId,
                Title = l.Title,
                Description = l.Description,
                OrderIndex = l.OrderIndex,
                VocabularyCount = l.Vocabularies.Count(v => !v.IsDeleted),
                GrammarCount = l.Grammars.Count(g => !g.IsDeleted),
                QuestionCount = l.Questions.Count(q => !q.IsDeleted)
            })
            .ToListAsync();

        _cache.Set(cacheKey, lessons, TimeSpan.FromMinutes(30));

        return lessons;
    }

    public async Task<LessonDto?> GetLessonByIdAsync(int lessonId)
    {
        return await _unitOfWork.Lessons.Query()
            .Where(l => l.LessonId == lessonId)
            .Select(l => new LessonDto
            {
                LessonId = l.LessonId,
                CourseId = l.CourseId,
                Title = l.Title,
                Description = l.Description,
                OrderIndex = l.OrderIndex,
                VocabularyCount = l.Vocabularies.Count(v => !v.IsDeleted),
                GrammarCount = l.Grammars.Count(g => !g.IsDeleted),
                QuestionCount = l.Questions.Count(q => !q.IsDeleted)
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<VocabularyDto>> GetVocabulariesByLessonAsync(int lessonId)
    {
        var cacheKey = $"vocabularies_lesson_{lessonId}";

        if (_cache.TryGetValue(cacheKey, out List<VocabularyDto>? cached) && cached != null)
            return cached;

        var vocabularies = await _unitOfWork.Vocabularies.Query()
            .Where(v => v.LessonId == lessonId)
            .Select(v => new VocabularyDto
            {
                VocabId = v.VocabId,
                LessonId = v.LessonId,
                Kanji = v.Kanji,
                Kana = v.Kana,
                Meaning = v.Meaning,
                Romaji = v.Romaji,
                AudioUrl = v.AudioUrl
            })
            .ToListAsync();

        _cache.Set(cacheKey, vocabularies, TimeSpan.FromMinutes(30));

        return vocabularies;
    }

    public async Task<List<GrammarDto>> GetGrammarsByLessonAsync(int lessonId)
    {
        var cacheKey = $"grammars_lesson_{lessonId}";

        if (_cache.TryGetValue(cacheKey, out List<GrammarDto>? cached) && cached != null)
            return cached;

        var grammars = await _unitOfWork.Grammars.Query()
            .Where(g => g.LessonId == lessonId)
            .Select(g => new GrammarDto
            {
                GrammarId = g.GrammarId,
                LessonId = g.LessonId,
                Structure = g.Structure,
                Explanation = g.Explanation,
                Example = g.Example,
                Note = g.Note
            })
            .ToListAsync();

        _cache.Set(cacheKey, grammars, TimeSpan.FromMinutes(30));

        return grammars;
    }
}
