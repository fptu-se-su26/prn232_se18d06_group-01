using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomCard;

public class CustomCardUpdateDto
{
    [MaxLength(50)]
    public string? Kanji { get; set; }

    [MaxLength(50)]
    public string? Hira { get; set; }

    [Required(ErrorMessage = "Cách đọc/từ khóa (Kana) không được để trống")]
    [MaxLength(100)]
    public string Kana { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nghĩa của từ không được để trống")]
    [MaxLength(200)]
    public string Meaning { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Romaji { get; set; }
}
