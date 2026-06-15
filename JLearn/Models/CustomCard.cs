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
    [MaxLength(1000)]
    public string Word { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Meaning { get; set; } = string.Empty;


    // Navigation properties
    [ForeignKey(nameof(DeckId))]
    public virtual CustomDeck CustomDeck { get; set; } = null!;
}
