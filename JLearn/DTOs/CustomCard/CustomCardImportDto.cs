using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomCard;

public class CustomCardImportDto
{
    [Required(ErrorMessage = "Chuỗi JSON để import không được để trống")]
    public string RawJson { get; set; } = string.Empty;
}
