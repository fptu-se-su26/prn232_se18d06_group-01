using JLearn.DTOs.Common;
using JLearn.DTOs.CustomCard;
using JLearn.DTOs.CustomDeck;
using JLearn.DTOs.QuizResult;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JLearn.Controllers;

[Authorize]
[ApiController]
[Route("api/custom-decks")]
public class CustomDecksController : ControllerBase
{
    private readonly ICustomDeckService _customDeckService;

    public CustomDecksController(ICustomDeckService customDeckService)
    {
        _customDeckService = customDeckService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Không xác định được danh tính người dùng.");
        return userId;
    }

    // GET: api/custom-decks
    [HttpGet]
    public async Task<IActionResult> GetDecks()
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.GetDecksByUserAsync(userId);
            return Ok(ApiResponse<List<CustomDeckDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }
    
    //GET: api/custom-decks/public
    [AllowAnonymous]
    [HttpGet("public")]
    public async Task<IActionResult> GetPublicDecks()
    {
        try
        {
            var result = await _customDeckService.GetPublicDecksAsync();
            return Ok(ApiResponse<List<CustomDeckDto>>.SuccessResponse(result));
        }
        catch(Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));

        }
    }

    // GET: api/custom-decks/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDeckById(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.GetDeckByIdAsync(userId, id);
            if (result == null) return NotFound(ApiResponse<object>.ErrorResponse("Bộ thẻ không tồn tại hoặc bạn không có quyền truy cập.", 404));
            return Ok(ApiResponse<CustomDeckDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // PUT: api/custom-decks/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDeck(int id, [FromBody] CustomDeckCreateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.UpdateDeckAsync(userId, id, dto);
            if (result == null) return NotFound(ApiResponse<object>.ErrorResponse("Bộ thẻ không tồn tại hoặc bạn không có quyền chỉnh sửa.", 404));
            return Ok(ApiResponse<CustomDeckDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // POST: api/custom-decks/{id}/clone
    [HttpPost("{id:int}/clone")]
    public async Task<IActionResult> CloneDeck(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.CloneDeckAsync(userId, id);
            return Ok(ApiResponse<CustomDeckDto>.SuccessResponse(result));
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

    // POST: api/custom-decks
    [HttpPost]
    public async Task<IActionResult> CreateDeck([FromBody] CustomDeckCreateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.CreateDeckAsync(userId, dto);
            return Ok(ApiResponse<CustomDeckDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // DELETE: api/custom-decks/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDeck(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.DeleteDeckAsync(userId, id);
            if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Bộ thẻ không tồn tại hoặc bạn không có quyền xóa.", 404));
            return Ok(ApiResponse<bool>.SuccessResponse(true));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // GET: api/custom-decks/{id}/cards
    [HttpGet("{id:int}/cards")]
    public async Task<IActionResult> GetCards(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.GetCardsByDeckAsync(userId, id);
            return Ok(ApiResponse<List<CustomCardDto>>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
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

    // POST: api/custom-decks/{id}/cards
    [HttpPost("{id:int}/cards")]
    public async Task<IActionResult> AddCard(int id, [FromBody] CustomCardCreateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.AddCardAsync(userId, id, dto);
            return Ok(ApiResponse<CustomCardDto>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // PUT: api/custom-decks/{id}/cards/{cardId}
    [HttpPut("{id:int}/cards/{cardId:int}")]
    public async Task<IActionResult> UpdateCard(int id, int cardId, [FromBody] CustomCardUpdateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.UpdateCardAsync(userId, id, cardId, dto);
            return Ok(ApiResponse<CustomCardDto>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
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

    // DELETE: api/custom-decks/{id}/cards/{cardId}
    [HttpDelete("{id:int}/cards/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int id, int cardId)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.DeleteCardAsync(userId, id, cardId);
            if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Thẻ không tồn tại.", 404));
            return Ok(ApiResponse<bool>.SuccessResponse(true));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // POST: api/custom-decks/{id}/import
    [HttpPost("{id:int}/import")]
    public async Task<IActionResult> ImportCards(int id, [FromBody] CustomCardImportDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.ImportCardsAsync(userId, id, dto.Content);
            return Ok(ApiResponse<bool>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // POST: api/custom-decks/{id}/quiz-results
    [HttpPost("{id:int}/quiz-results")]
    public async Task<IActionResult> SaveQuizResult(int id, [FromBody] QuizResultCreateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.SaveQuizResultAsync(userId, id, dto);
            return Ok(ApiResponse<QuizResultDto>.SuccessResponse(result));
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

    // GET: api/custom-decks/{id}/quiz-results
    [HttpGet("{id:int}/quiz-results")]
    public async Task<IActionResult> GetQuizResultsByDeck(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.GetQuizResultsByDeckAsync(userId, id);
            return Ok(ApiResponse<List<QuizResultDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }

    // GET: api/custom-decks/quiz-history
    [HttpGet("quiz-history")]
    public async Task<IActionResult> GetUserQuizHistory([FromQuery] int limit = 10)
    {
        try
        {
            var userId = GetUserId();
            var result = await _customDeckService.GetUserQuizHistoryAsync(userId, limit);
            return Ok(ApiResponse<List<QuizResultDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message, 400));
        }
    }
}

