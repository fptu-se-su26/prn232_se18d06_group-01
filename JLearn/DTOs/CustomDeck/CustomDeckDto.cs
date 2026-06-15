namespace JLearn.DTOs.CustomDeck;

public class CustomDeckDto
{
    public int DeckId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalCards { get; set; }

    public bool IsPublic { get; set; }
}
