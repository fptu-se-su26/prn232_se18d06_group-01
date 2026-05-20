using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class Question : BaseEntity
{
    [Key]
    public int QuestionId { get; set; }

    public int LessonId { get; set; }

    [Required, MaxLength(500)]
    public string Content { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string OptionA { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string OptionB { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string OptionC { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string OptionD { get; set; } = string.Empty;

    [Required, MaxLength(1)]
    public string CorrectAnswer { get; set; } = string.Empty; // "A", "B", "C", or "D"

    public string? Explanation { get; set; }

    // Navigation properties
    [ForeignKey(nameof(LessonId))]
    public virtual Lesson Lesson { get; set; } = null!;
}