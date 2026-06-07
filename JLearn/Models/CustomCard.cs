using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class CustomCard : BaseEntity
{
    [Key]
    public int CardId { get; set; }

    public int DeckId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Word { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Meaning { get; set; } = string.Empty;

    // SRS fields
    public int Level { get; set; } = 1;
    public DateTime NextReviewDate { get; set; } = DateTime.UtcNow;
    public double EaseFactor { get; set; } = 2.5;
    public int Repetitions { get; set; } = 0;
    public int IntervalDays { get; set; } = 0;

    // Navigation properties
    [ForeignKey(nameof(DeckId))]
    public virtual CustomDeck CustomDeck { get; set; } = null!;
}
