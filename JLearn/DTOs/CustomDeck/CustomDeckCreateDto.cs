using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomDeck;

public class CustomDeckCreateDto
{
    [Required(ErrorMessage = "Tên bộ thẻ không được để trống")]
    [MaxLength(100, ErrorMessage = "Tên bộ thẻ không được dài quá 100 ký tự")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Mô tả không được dài quá 500 ký tự")]
    public string? Description { get; set; }

    public bool IsPublic { get; set; }
}
