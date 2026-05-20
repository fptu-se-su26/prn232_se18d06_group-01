using JLearn.DTOs.Common;
using JLearn.DTOs.Grammar;
using JLearn.DTOs.Lesson;
using JLearn.DTOs.Vocabulary;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonsController(ILessonService lessonService)
    {
        _lessonService = lessonService;
    }

    /// <summary>
    /// Lấy chi tiết 1 bài học
    /// </summary>
    [HttpGet("{lessonId:int}")]
    public async Task<IActionResult> GetLesson(int lessonId)
    {
        var result = await _lessonService.GetLessonByIdAsync(lessonId);
        if (result == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bài học", 404));

        return Ok(ApiResponse<LessonDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Lấy danh sách từ vựng của bài học
    /// </summary>
    [HttpGet("{lessonId:int}/vocabularies")]
    public async Task<IActionResult> GetVocabularies(int lessonId)
    {
        var lesson = await _lessonService.GetLessonByIdAsync(lessonId);
        if (lesson == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bài học", 404));

        var result = await _lessonService.GetVocabulariesByLessonAsync(lessonId);
        return Ok(ApiResponse<List<VocabularyDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Lấy danh sách ngữ pháp của bài học
    /// </summary>
    [HttpGet("{lessonId:int}/grammars")]
    public async Task<IActionResult> GetGrammars(int lessonId)
    {
        var lesson = await _lessonService.GetLessonByIdAsync(lessonId);
        if (lesson == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bài học", 404));

        var result = await _lessonService.GetGrammarsByLessonAsync(lessonId);
        return Ok(ApiResponse<List<GrammarDto>>.SuccessResponse(result));
    }
}
