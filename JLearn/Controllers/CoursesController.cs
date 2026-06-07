using JLearn.DTOs.Common;
using JLearn.DTOs.Course;
using JLearn.DTOs.Lesson;
using JLearn.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly ILessonService _lessonService;

    public CoursesController(ICourseService courseService, ILessonService lessonService)
    {
        _courseService = courseService;
        _lessonService = lessonService;
    }

    /// <summary>
    /// Lấy danh sách khóa học (có phân trang)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCourses([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _courseService.GetCoursesAsync(pageNumber, pageSize);
        return Ok(ApiResponse<PaginatedList<CourseDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Lấy chi tiết 1 khóa học
    /// </summary>
    [HttpGet("{courseId:int}")]
    public async Task<IActionResult> GetCourse(int courseId)
    {
        var result = await _courseService.GetCourseByIdAsync(courseId);
        if (result == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy khóa học", 404));

        return Ok(ApiResponse<CourseDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Lấy danh sách bài học theo khóa học
    /// </summary>
    [HttpGet("{courseId:int}/lessons")]
    public async Task<IActionResult> GetLessons(int courseId)
    {
        var course = await _courseService.GetCourseByIdAsync(courseId);
        if (course == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Không tìm thấy khóa học", 404));

        var result = await _lessonService.GetLessonsByCourseAsync(courseId);
        return Ok(ApiResponse<List<LessonDto>>.SuccessResponse(result));
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCourse([FromBody] CourseCreateDto dto)
    {
        var result = await _courseService.CreateAsync(dto);
        return Ok(ApiResponse<CourseDto>.SuccessResponse(result));
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] CourseUpdateDto dto)
    {
        try
        {
            var result = await _courseService.UpdateAsync(id, dto);
            return Ok(ApiResponse<CourseDto>.SuccessResponse(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message, 404));
        }
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var result = await _courseService.DeleteAsync(id);
        if (!result) return NotFound(ApiResponse<object>.ErrorResponse("Course not found", 404));
        return Ok(ApiResponse<bool>.SuccessResponse(true));
    }
}
