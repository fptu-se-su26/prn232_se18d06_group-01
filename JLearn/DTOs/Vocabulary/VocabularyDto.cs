namespace JLearn.DTOs.Vocabulary;

public class VocabularyDto
{
    public int VocabId { get; set; }
    public int LessonId { get; set; }
    public string? Kanji { get; set; }
    public string Kana { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string? Romaji { get; set; }
    public string? AudioUrl { get; set; }
}
