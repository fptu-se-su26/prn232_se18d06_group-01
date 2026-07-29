using JLearn.DTOs.Admin;

namespace JLearn.Services.Interfaces;

public interface IAdminService
{
    // Thống kê
    Task<SystemStatDto> GetSystemStatsAsync();
    // Quản lý Users
    Task<List<UserStatDto>> GetAllUsersAsync();
    Task<UserStatDto?> GetUserByIdAsync(int userId);
    Task<bool> ChangeUserRoleAsync(int userId, string newRole);
    Task<bool> ToggleLockUserAsync(int userId);
    Task<bool> DeleteUserAsync(int userId);
    // Quản lý Decks
    Task<List<DecksStatDto>> GetAllDecksAsync();
    Task<bool> DeleteDeckAsync(int deckId);
    
}