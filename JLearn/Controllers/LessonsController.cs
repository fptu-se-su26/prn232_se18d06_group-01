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

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateLesson([FromBody] LessonCreateDto dto)
    {
        var result = await _lessonService.CreateAsync(dto);
        return Ok(ApiResponse<LessonDto>.SuccessResponse(result));
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] LessonUpdateDto dto)
    {
        try
        {
            var result = await _lessonService.UpdateAsync(id, dto);
            return Ok(ApiResponse<LessonDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        var result = await _lessonService.DeleteAsync(id);
        if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Lesson not found", 404));
        return Ok(ApiResponse<bool>.SuccessResponse(true));
    }

    [HttpPost("vocabularies")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateVocabulary([FromBody] VocabularyCreateDto dto)
    {
        var result = await _lessonService.CreateVocabularyAsync(dto);
        return Ok(ApiResponse<VocabularyDto>.SuccessResponse(result));
    }

    [HttpPut("vocabularies/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateVocabulary(int id, [FromBody] VocabularyUpdateDto dto)
    {
        try
        {
            var result = await _lessonService.UpdateVocabularyAsync(id, dto);
            return Ok(ApiResponse<VocabularyDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpDelete("vocabularies/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVocabulary(int id)
    {
        var result = await _lessonService.DeleteVocabularyAsync(id);
        if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Vocabulary not found", 404));
        return Ok(ApiResponse<bool>.SuccessResponse(true));
    }

    [HttpPost("grammars")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammar([FromBody] GrammarCreateDto dto)
    {
        var result = await _lessonService.CreateGrammarAsync(dto);
        return Ok(ApiResponse<GrammarDto>.SuccessResponse(result));
    }

    [HttpPut("grammars/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammar(int id, [FromBody] GrammarUpdateDto dto)
    {
        try
        {
            var result = await _lessonService.UpdateGrammarAsync(id, dto);
            return Ok(ApiResponse<GrammarDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpDelete("grammars/{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammar(int id)
    {
        var result = await _lessonService.DeleteGrammarAsync(id);
        if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Grammar not found", 404));
        return Ok(ApiResponse<bool>.SuccessResponse(true));
    }
}
