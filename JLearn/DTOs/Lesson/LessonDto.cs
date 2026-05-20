namespace JLearn.DTOs.Lesson;

public class LessonDto
{
    public int LessonId { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public int VocabularyCount { get; set; }
    public int GrammarCount { get; set; }
    public int QuestionCount { get; set; }
}
