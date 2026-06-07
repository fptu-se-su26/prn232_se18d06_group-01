namespace JLearn.DTOs.Grammar;

public class GrammarCreateDto
{
    public int LessonId { get; set; }
    public string Structure { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string Example { get; set; } = string.Empty;
    public string? Note { get; set; }
}
