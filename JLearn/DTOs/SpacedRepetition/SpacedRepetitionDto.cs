namespace JLearn.DTOs.SpacedRepetition;


public class ReviewRequestDto
{
    public int VocabularyId { get; set; }
    public int Quality { get; set; } // Điểm số từ 0 đến 5
}
public class ReviewResultDto
{
    public int VocabularyId { get; set; }
    public string Word { get; set; } = string.Empty;
    public int NextIntervalDays { get; set; }
    public DateTime NextReviewDate { get; set; }
}