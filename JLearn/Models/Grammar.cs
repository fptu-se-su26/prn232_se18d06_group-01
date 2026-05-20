using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class Grammar : BaseEntity
{
    [Key]
    public int GrammarId { get; set; }

    public int LessonId { get; set; }

    [Required, MaxLength(200)]
    public string Structure { get; set; } = string.Empty;

    [Required]
    public string Explanation { get; set; } = string.Empty;

    [Required]
    public string Example { get; set; } = string.Empty;

    public string? Note { get; set; }

    // Navigation properties
    [ForeignKey(nameof(LessonId))]
    public virtual Lesson Lesson { get; set; } = null!;
}