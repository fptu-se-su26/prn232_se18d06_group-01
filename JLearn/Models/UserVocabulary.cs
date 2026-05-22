using System.ComponentModel.DataAnnotations.Schema;

namespace JLearn.Models;

public class UserVocabulary
{
    public int UserId { get; set; }
    public int VocabId { get; set; }

    public int Level { get; set; } = 1; // 1-5
    public DateTime NextReviewDate { get; set; } = DateTime.UtcNow;

    // SM-2 Algorithm fields
    public double EaseFactor { get; set; } = 2.5; // Hệ số dễ (mặc định 2.5)
    public int Repetitions { get; set; } = 0;     // Số lần lặp lại liên tiếp thành công
    public int IntervalDays { get; set; } = 0;    // Khoảng cách ngày đến lần ôn tập tiếp theo

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(VocabId))]
    public virtual Vocabulary Vocabulary { get; set; } = null!;
}