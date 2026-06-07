namespace JLearn.DTOs.CustomCard;

public class CustomCardDto
{
    public int CardId { get; set; }
    public int DeckId { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;

    // SRS properties
    public int Level { get; set; }
    public DateTime NextReviewDate { get; set; }
    public double EaseFactor { get; set; }
    public int Repetitions { get; set; }
    public int IntervalDays { get; set; }
}
