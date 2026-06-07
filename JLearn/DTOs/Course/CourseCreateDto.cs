namespace JLearn.DTOs.Course;

public class CourseCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
}
