using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.CustomCard;

public class CustomCardReviewDto
{
    [Required]
    public int CardId { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Đánh giá phải nằm trong khoảng từ 1 đến 5")]
    public int Rating { get; set; }
}
