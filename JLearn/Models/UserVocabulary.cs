using System.ComponentModel.DataAnnotations.Schema;

namespace JLearn.Models;

public class UserVocabulary
{
    public int UserId { get; set; }
    public int VocabId { get; set; }

    public int Level { get; set; } = 1; // 1-5
    public DateTime NextReviewDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(VocabId))]
    public virtual Vocabulary Vocabulary { get; set; } = null!;
}