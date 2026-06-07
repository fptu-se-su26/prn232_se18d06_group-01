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

    public async Task<LessonDto> CreateAsync(LessonCreateDto dto)
    {
        var lesson = new JLearn.Models.Lesson
        {
            CourseId = dto.CourseId,
            Title = dto.Title,
            Description = dto.Description,
            OrderIndex = dto.OrderIndex
        };
        await _unitOfWork.Lessons.AddAsync(lesson);
        await _unitOfWork.SaveChangesAsync();

        return new LessonDto
        {
            LessonId = lesson.LessonId,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Description = lesson.Description,
            OrderIndex = lesson.OrderIndex,
            VocabularyCount = 0,
            GrammarCount = 0,
            QuestionCount = 0
        };
    }

    public async Task<LessonDto> UpdateAsync(int lessonId, LessonUpdateDto dto)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(lessonId);
        if (lesson == null) throw new KeyNotFoundException("Lesson not found");

        lesson.CourseId = dto.CourseId;
        lesson.Title = dto.Title;
        lesson.Description = dto.Description;
        lesson.OrderIndex = dto.OrderIndex;

        _unitOfWork.Lessons.Update(lesson);
        await _unitOfWork.SaveChangesAsync();

        return new LessonDto
        {
            LessonId = lesson.LessonId,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Description = lesson.Description,
            OrderIndex = lesson.OrderIndex,
            VocabularyCount = lesson.Vocabularies?.Count(v => !v.IsDeleted) ?? 0,
            GrammarCount = lesson.Grammars?.Count(g => !g.IsDeleted) ?? 0,
            QuestionCount = lesson.Questions?.Count(q => !q.IsDeleted) ?? 0
        };
    }

    public async Task<bool> DeleteAsync(int lessonId)
    {
        var lesson = await _unitOfWork.Lessons.GetByIdAsync(lessonId);
        if (lesson == null) return false;

        lesson.IsDeleted = true;
        _unitOfWork.Lessons.Update(lesson);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<VocabularyDto> CreateVocabularyAsync(VocabularyCreateDto dto)
    {
        var vocab = new JLearn.Models.Vocabulary
        {
            LessonId = dto.LessonId,
            Kanji = dto.Kanji,
            Hira = dto.Hira,
            Kana = dto.Kana,
            Meaning = dto.Meaning,
            Romaji = dto.Romaji,
            AudioUrl = dto.AudioUrl
        };
        await _unitOfWork.Vocabularies.AddAsync(vocab);
        await _unitOfWork.SaveChangesAsync();

        return new VocabularyDto
        {
            VocabId = vocab.VocabId,
            LessonId = vocab.LessonId,
            Kanji = vocab.Kanji,
            Hira = vocab.Hira,
            Kana = vocab.Kana,
            Meaning = vocab.Meaning,
            Romaji = vocab.Romaji,
            AudioUrl = vocab.AudioUrl
        };
    }

    public async Task<VocabularyDto> UpdateVocabularyAsync(int vocabId, VocabularyUpdateDto dto)
    {
        var vocab = await _unitOfWork.Vocabularies.GetByIdAsync(vocabId);
        if (vocab == null) throw new KeyNotFoundException("Vocabulary not found");

        vocab.LessonId = dto.LessonId;
        vocab.Kanji = dto.Kanji;
        vocab.Hira = dto.Hira;
        vocab.Kana = dto.Kana;
        vocab.Meaning = dto.Meaning;
        vocab.Romaji = dto.Romaji;
        vocab.AudioUrl = dto.AudioUrl;

        _unitOfWork.Vocabularies.Update(vocab);
        await _unitOfWork.SaveChangesAsync();

        return new VocabularyDto
        {
            VocabId = vocab.VocabId,
            LessonId = vocab.LessonId,
            Kanji = vocab.Kanji,
            Hira = vocab.Hira,
            Kana = vocab.Kana,
            Meaning = vocab.Meaning,
            Romaji = vocab.Romaji,
            AudioUrl = vocab.AudioUrl
        };
    }

    public async Task<bool> DeleteVocabularyAsync(int vocabId)
    {
        var vocab = await _unitOfWork.Vocabularies.GetByIdAsync(vocabId);
        if (vocab == null) return false;

        vocab.IsDeleted = true;
        _unitOfWork.Vocabularies.Update(vocab);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<GrammarDto> CreateGrammarAsync(GrammarCreateDto dto)
    {
        var grammar = new JLearn.Models.Grammar
        {
            LessonId = dto.LessonId,
            Structure = dto.Structure,
            Explanation = dto.Explanation,
            Example = dto.Example,
            Note = dto.Note
        };
        await _unitOfWork.Grammars.AddAsync(grammar);
        await _unitOfWork.SaveChangesAsync();

        return new GrammarDto
        {
            GrammarId = grammar.GrammarId,
            LessonId = grammar.LessonId,
            Structure = grammar.Structure,
            Explanation = grammar.Explanation,
            Example = grammar.Example,
            Note = grammar.Note
        };
    }

    public async Task<GrammarDto> UpdateGrammarAsync(int grammarId, GrammarUpdateDto dto)
    {
        var grammar = await _unitOfWork.Grammars.GetByIdAsync(grammarId);
        if (grammar == null) throw new KeyNotFoundException("Grammar not found");

        grammar.LessonId = dto.LessonId;
        grammar.Structure = dto.Structure;
        grammar.Explanation = dto.Explanation;
        grammar.Example = dto.Example;
        grammar.Note = dto.Note;

        _unitOfWork.Grammars.Update(grammar);
        await _unitOfWork.SaveChangesAsync();

        return new GrammarDto
        {
            GrammarId = grammar.GrammarId,
            LessonId = grammar.LessonId,
            Structure = grammar.Structure,
            Explanation = grammar.Explanation,
            Example = grammar.Example,
            Note = grammar.Note
        };
    }

    public async Task<bool> DeleteGrammarAsync(int grammarId)
    {
        var grammar = await _unitOfWork.Grammars.GetByIdAsync(grammarId);
        if (grammar == null) return false;

        grammar.IsDeleted = true;
        _unitOfWork.Grammars.Update(grammar);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
