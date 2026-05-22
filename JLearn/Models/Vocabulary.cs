using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JLearn.Models.Base;

namespace JLearn.Models;

public class Vocabulary : BaseEntity
{
    [Key]
    public int VocabId { get; set; }

    public int LessonId { get; set; }

    [MaxLength(50)]
    public string? Kanji { get; set; }
    
    [MaxLength(50)]
    public string? Hira { get; set; }

    [Required, MaxLength(100)]
    public string Kana { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Meaning { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Romaji { get; set; }

    [MaxLength(500)]
    public string? AudioUrl { get; set; }

    // Navigation properties
    [ForeignKey(nameof(LessonId))]
    public virtual Lesson Lesson { get; set; } = null!;

    public virtual ICollection<UserVocabulary> UserVocabularies { get; set; } = new List<UserVocabulary>();
}