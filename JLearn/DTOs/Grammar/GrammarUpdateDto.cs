namespace JLearn.DTOs.Grammar;

public class GrammarUpdateDto
{
    public int LessonId { get; set; }
    public string Structure { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string Example { get; set; } = string.Empty;
    public string? Note { get; set; }
}
