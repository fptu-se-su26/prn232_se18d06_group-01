using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.Admin;

public class SystemStatDto
{
    public int TotalUsers { get; set; }
    public int TotalDecks { get; set; }
    public int TotalCards { get; set; }
    public int TotalQuizAttempts { get; set; }
    public int TotalPublicDecks { get; set; }
    public int NewUsersLastWeek { get; set; }
    public int NewUsersLastMonth { get; set; }
    public int NewUserToday { get; set; }
}

public class UserStatDto
{
    public string UserFullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool isLocked { get; set; }
    public int TotalDecks { get; set; }
    public int TotalCards { get; set; }
    public int TotalQuizAttempts { get; set; }
}

public class ChangeRoleDto
{
    public int UserId { get; set; }
    [Required]
    public string Role { get; set; } = string.Empty;
}

public class DecksStatDto
{
    public int DeckId { get; set; }
    public string? Description { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public string DeckName { get; set; } = string.Empty;
    public int TotalCards { get; set; }
    //owner
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
}