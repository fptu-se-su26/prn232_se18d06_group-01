using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class Lesson : BaseEntity
{
    [Key]
    public int LessonId { get; set; }

    public int CourseId { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public int OrderIndex { get; set; } = 0;

    // Navigation properties
    [ForeignKey(nameof(CourseId))]
    public virtual Course Course { get; set; } = null!;

    public virtual ICollection<Vocabulary> Vocabularies { get; set; } = new List<Vocabulary>();
    public virtual ICollection<Grammar> Grammars { get; set; } = new List<Grammar>();
    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    public virtual ICollection<QuizResult> QuizResults { get; set; } = new List<QuizResult>();
}