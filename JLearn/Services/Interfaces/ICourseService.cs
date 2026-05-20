using JLearn.DTOs.Common;
using JLearn.DTOs.Course;

namespace JLearn.Services.Interfaces;

public interface ICourseService
{
    Task<PaginatedList<CourseDto>> GetCoursesAsync(int pageNumber, int pageSize);
    Task<CourseDto?> GetCourseByIdAsync(int courseId);
}
