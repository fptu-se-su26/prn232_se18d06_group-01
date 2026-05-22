using System.Security.Claims;
using JLearn.DTOs.Common;
using JLearn.DTOs.Quiz;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JLearn.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizzesController(IQuizService quizService)
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

    // Hỗ trợ cả /api/quizzes/lessons/{lessonId} (theo baseline) và /api/quizzes/lesson/{lessonId} (theo guide)
    // [HttpGet("lessons/{lessonId:int}")]
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
}
