namespace JLearn.DTOs.QuizResult;

public class QuizResultDto
{
    public int QuizResultId { get; set; }
    public int DeckId { get; set; }
    public string DeckName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string QuizType { get; set; } = "jp-vi";
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double ScorePercentage { get; set; }
    public DateTime CompletedAt { get; set; }
}
