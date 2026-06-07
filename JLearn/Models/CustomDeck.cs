using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class CustomDeck : BaseEntity
{
    [Key]
    public int DeckId { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    public virtual ICollection<CustomCard> CustomCards { get; set; } = new List<CustomCard>();
}
