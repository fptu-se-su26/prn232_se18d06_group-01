using System.ComponentModel.DataAnnotations;
using JLearn.Models.Base;

namespace JLearn.Models;

public class User : BaseEntity
{
    [Key]
    public int UserId { get; set; }

    [Required, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Learner;

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Navigation properties
    public virtual ICollection<UserVocabulary> UserVocabularies { get; set; } = new List<UserVocabulary>();
    public virtual ICollection<QuizResult> QuizResults { get; set; } = new List<QuizResult>();
}