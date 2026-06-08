using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomCard;

public class CustomCardCreateDto
{
    [Required(ErrorMessage = "Từ khóa không được để trống")]
    [MaxLength(1000)]
    public string Word { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nghĩa không được để trống")]
    [MaxLength(1000)]
    public string Meaning { get; set; } = string.Empty;
}
