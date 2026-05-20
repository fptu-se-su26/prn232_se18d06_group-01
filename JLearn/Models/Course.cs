using System.ComponentModel.DataAnnotations;
using JLearn.Models.Base;

namespace JLearn.Models;

public class Course : BaseEntity
{
    [Key]
    public int CourseId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public int OrderIndex { get; set; } = 0;

    // Navigation properties
    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}