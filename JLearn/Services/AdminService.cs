using JLearn.DTOs.Admin;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;

namespace JLearn.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    public AdminService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    public Task<SystemStatDto> GetSystemStatsAsync()
    {
        _unitOfWork.Users.Query();
    }

    public Task<List<UserStatDto>> GetAllUsersAsync()
    {
        throw new NotImplementedException();
    }

    public Task<UserStatDto?> GetUserByIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ChangeUserRoleAsync(int userId, string newRole)
    {
        throw new NotImplementedException();
    }

    public Task<bool> TxsoggleLockUserAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteUserAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<List<DecksStatDto>> GetAllDecksAsync()
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteDeckAsync(int deckId)
    {
        throw new NotImplementedException();
    }
}