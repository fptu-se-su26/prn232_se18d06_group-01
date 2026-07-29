using Microsoft.EntityFrameworkCore;
using JLearn.DTOs.Admin;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using JLearn.Models;

namespace JLearn.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    public AdminService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    public async Task<SystemStatDto> GetSystemStatsAsync()
    {
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var lastSevenDays = now.AddDays(-7);
        var lastThirtyDays = now.AddDays(-30);

        var totalUsers = await _unitOfWork.Users.Query().CountAsync();
        var totalDecks = await _unitOfWork.CustomDecks.Query().CountAsync();
        var totalCards = await _unitOfWork.CustomCards.Query().CountAsync();
        var totalQuizAttempts = await _unitOfWork.QuizResults.Query().CountAsync();
        var totalPublicDecks = await _unitOfWork.CustomDecks.Query().CountAsync(d => d.IsPublic);

        var newUserToday = await _unitOfWork.Users.Query().CountAsync(u => u.CreatedAt >= todayStart);
        var newUsersLastWeek = await _unitOfWork.Users.Query().CountAsync(u => u.CreatedAt >= lastSevenDays);
        var newUsersLastMonth = await _unitOfWork.Users.Query().CountAsync(u => u.CreatedAt >= lastThirtyDays);

        return new SystemStatDto
        {
            TotalUsers = totalUsers,
            TotalDecks = totalDecks,
            TotalCards = totalCards,
            TotalQuizAttempts = totalQuizAttempts,
            TotalPublicDecks = totalPublicDecks,
            NewUserToday = newUserToday,
            NewUsersLastWeek = newUsersLastWeek,
            NewUsersLastMonth = newUsersLastMonth
        };
    }

    public async Task<List<UserStatDto>> GetAllUsersAsync()
    {
        return await _unitOfWork.Users.Query()
            .Where(u => !u.IsDeleted && !u.isLocked)
            .Select(u => new UserStatDto
            {
                UserFullName = u.FullName,
                Email = u.Email,
                isLocked = u.isLocked,
                Role = u.Role.ToString(),
                TotalDecks = u.CustomDecks.Count(),
                TotalCards = u.CustomDecks.SelectMany(d => d.CustomCards).Count(),
                TotalQuizAttempts = u.QuizResults.Count()
            })
            .ToListAsync();
    }

    public  Task<UserStatDto?> GetUserByIdAsync(int userId)
    {
        return  _unitOfWork.Users.Query()
            .Where(u => u.UserId == userId && !u.IsDeleted)
            .Select(u => new UserStatDto
            {
                UserFullName = u.FullName,
                Email = u.Email,
                isLocked = u.isLocked,
                Role = u.Role.ToString(),
                TotalDecks = u.CustomDecks.Count(),
                TotalCards = u.CustomDecks.SelectMany(d => d.CustomCards).Count(),
                TotalQuizAttempts = u.QuizResults.Count()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ChangeUserRoleAsync(int userId, string newRole)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null || user.IsDeleted) return false;

        if (Enum.TryParse<UserRole>(newRole, true, out var parsedRole))
        {
            user.Role = parsedRole;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<bool> ToggleLockUserAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null || user.IsDeleted) return false;

        user.isLocked = !user.isLocked;
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null || user.IsDeleted) return false;

        user.IsDeleted = true;
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<List<DecksStatDto>> GetAllDecksAsync()
    {
        return await _unitOfWork.CustomDecks.Query()
            .Where(d => !d.IsDeleted)
            .Include(d => d.User)
            .Select(d => new DecksStatDto
            {
                DeckId = d.DeckId,
                DeckName = d.Name,
                Description = d.Description,
                IsPublic = d.IsPublic,
                CreatedAt = d.CreatedAt,
                TotalCards = d.CustomCards.Count(c => !c.IsDeleted),
                UserId = d.UserId,
                UserFullName = d.User.FullName,
                UserEmail = d.User.Email
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteDeckAsync(int deckId)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.IsDeleted) return false;

        deck.IsDeleted = true;
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}