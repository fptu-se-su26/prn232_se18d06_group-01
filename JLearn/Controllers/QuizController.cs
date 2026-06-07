using System.Security.Claims;
using JLearn.DTOs.Common;
using JLearn.DTOs.Quiz;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JLearn.Controllers;


[Authorize]
[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Không xác định được danh tính người dùng.");
        return userId;
    }
    [HttpGet("lesson/{lessonId:int}")]
    public async Task<ActionResult<List<QuizQuestionDto>>> GetQuizByLesson(int lessonId)
    {
        try
        {
            var result = await _quizService.GetQuizByLessonAsync(lessonId);
            return Ok(ApiResponse<List<QuizQuestionDto>>.SuccessResponse(result));
            
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmitDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _quizService.SubmitQuizAsync(userId, dto);
            return Ok(ApiResponse<QuizResultDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateQuestion([FromBody] QuizQuestionCreateDto dto)
    {
        var result = await _quizService.CreateQuestionAsync(dto);
        return Ok(ApiResponse<QuizQuestionDto>.SuccessResponse(result));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuizQuestionUpdateDto dto)
    {
        try
        {
            var result = await _quizService.UpdateQuestionAsync(id, dto);
            return Ok(ApiResponse<QuizQuestionDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        var result = await _quizService.DeleteQuestionAsync(id);
        if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Question not found", 404));
        return Ok(ApiResponse<bool>.SuccessResponse(true));
    }
}