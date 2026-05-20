namespace JLearn.DTOs.Course;

public class CourseDto
{
    public int CourseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public int LessonCount { get; set; }
}
