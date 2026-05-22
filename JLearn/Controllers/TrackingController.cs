using System.Security.Claims;
using JLearn.DTOs.Common;
using JLearn.DTOs.SpacedRepetition;
using JLearn.DTOs.Vocabulary;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JLearn.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[Route("api/spacedrepetition")]
public class TrackingController : ControllerBase
{
    private readonly ISpacedRepetitionService _spacedRepetitionService;

    public TrackingController(ISpacedRepetitionService spacedRepetitionService)
    {
        _spacedRepetitionService = spacedRepetitionService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Không xác định được danh tính người dùng.");
        return userId;
    }

    [HttpGet("reviews")]
    [HttpGet("due")]
    public async Task<ActionResult<List<VocabularyDto>>> GetDueVocabularies()
    {
        try
        {
            var userId = GetUserId();
            var result = await _spacedRepetitionService.GetDueVocabulariesAsync(userId);
            return Ok(ApiResponse<List<VocabularyDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    [HttpPost("vocabularies/{vocabId:int}/review")]
    public async Task<IActionResult> ProcessReviewRoute(int vocabId, [FromBody] ReviewRequestDto dto)
    {
        dto.VocabularyId = vocabId;
        return await ProcessReview(dto);
    }

    [HttpPost("review")]
    public async Task<IActionResult> ProcessReview([FromBody] ReviewRequestDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _spacedRepetitionService.ProcessReviewAsync(userId, dto);
            return Ok(ApiResponse<ReviewResultDto>.SuccessResponse(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }
}
