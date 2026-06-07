namespace JLearn.DTOs.Lesson;

public class LessonUpdateDto
{
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
}
