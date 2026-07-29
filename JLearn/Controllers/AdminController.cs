using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JLearn.DTOs.Admin;
using JLearn.DTOs.Common;
using JLearn.Services.Interfaces;
using JLearn.Models;

namespace JLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,1")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetSystemStats()
    {
        var stats = await _adminService.GetSystemStatsAsync();
        return Ok(ApiResponse<SystemStatDto>.SuccessResponse(stats, "Thống kê hệ thống lấy thành công"));
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(ApiResponse<List<UserStatDto>>.SuccessResponse(users, "Danh sách người dùng lấy thành công"));
    }

    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _adminService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy người dùng", 404));

        return Ok(ApiResponse<UserStatDto>.SuccessResponse(user, "Lấy thông tin người dùng thành công"));
    }

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> ChangeUserRole(int id, [FromBody] ChangeRoleDto dto)
    {
        if (id != dto.UserId)
            return BadRequest(ApiResponse<object>.ErrorResponse("ID người dùng không hợp lệ", 400));

        var success = await _adminService.ChangeUserRoleAsync(id, dto.Role);
        if (!success)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy người dùng hoặc cập nhật thất bại", 404));

        return Ok(ApiResponse<object>.SuccessResponse(new object(), "Cập nhật vai trò thành công"));
    }

    [HttpPut("users/{id}/toggle-lock")]
    public async Task<IActionResult> ToggleLockUser(int id)
    {
        var success = await _adminService.ToggleLockUserAsync(id);
        if (!success)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy người dùng hoặc cập nhật thất bại", 404));

        return Ok(ApiResponse<object>.SuccessResponse(new object(), "Đã khóa/mở khóa người dùng"));
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var success = await _adminService.DeleteUserAsync(id);
        if (!success)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy người dùng hoặc xóa thất bại", 404));

        return Ok(ApiResponse<object>.SuccessResponse(new object(), "Đã xóa người dùng thành công"));
    }

    [HttpGet("decks")]
    public async Task<IActionResult> GetAllDecks()
    {
        var decks = await _adminService.GetAllDecksAsync();
        return Ok(ApiResponse<List<DecksStatDto>>.SuccessResponse(decks, "Danh sách bộ thẻ lấy thành công"));
    }

    [HttpDelete("decks/{id}")]
    public async Task<IActionResult> DeleteDeck(int id)
    {
        var success = await _adminService.DeleteDeckAsync(id);
        if (!success)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy bộ thẻ hoặc xóa thất bại", 404));

        return Ok(ApiResponse<object>.SuccessResponse(new object(), "Đã xóa bộ thẻ thành công"));
    }
}
