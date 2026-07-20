using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class QuizResult : BaseEntity
{
    [Key]
    public int QuizResultId { get; set; }

    public int UserId { get; set; }

    public int DeckId { get; set; }

    [Required]
    [MaxLength(50)]
    public string QuizType { get; set; } = "jp-vi"; // "jp-vi", "vi-jp", "mixed"

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public double ScorePercentage { get; set; }

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(DeckId))]
    public virtual CustomDeck CustomDeck { get; set; } = null!;
}
