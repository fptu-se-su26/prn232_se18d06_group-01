using System.ComponentModel.DataAnnotations;

namespace JLearn.DTOs.QuizResult;

public class QuizResultCreateDto
{
    [Required]
    [MaxLength(50)]
    public string QuizType { get; set; } = "jp-vi";

    [Range(1, 1000)]
    public int TotalQuestions { get; set; }

    [Range(0, 1000)]
    public int CorrectAnswers { get; set; }
}
