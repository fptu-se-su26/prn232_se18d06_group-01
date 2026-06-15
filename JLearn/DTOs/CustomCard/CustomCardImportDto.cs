using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomCard;

public class CustomCardImportDto
{
    [Required(ErrorMessage = "Nội dung import không được để trống")]
    public string Content { get; set; } = string.Empty;
}
