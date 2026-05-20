using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JLearn.Models;

public class QuizResult
{
    [Key]
    public int ResultId { get; set; }

    public int UserId { get; set; }
    public int LessonId { get; set; }

    public int TotalScore { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(LessonId))]
    public virtual Lesson Lesson { get; set; } = null!;
}
