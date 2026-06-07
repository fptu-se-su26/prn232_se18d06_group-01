using JLearn.DTOs.Common;
using JLearn.DTOs.Course;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace JLearn.Services;

public class CourseService : ICourseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private const string CacheKeyPrefix = "courses_";

    public CourseService(IUnitOfWork unitOfWork, IMemoryCache cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<PaginatedList<CourseDto>> GetCoursesAsync(int pageNumber, int pageSize)
    {
        var cacheKey = $"{CacheKeyPrefix}page_{pageNumber}_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PaginatedList<CourseDto>? cached) && cached != null)
            return cached;

        var query = _unitOfWork.Courses.Query()
            .OrderBy(c => c.OrderIndex)
            .Select(c => new CourseDto
            {
                CourseId = c.CourseId,
                Name = c.Name,
                Description = c.Description,
                OrderIndex = c.OrderIndex,
                LessonCount = c.Lessons.Count(l => !l.IsDeleted)
            });

        var result = await PaginatedList<CourseDto>.CreateAsync(query, pageNumber, pageSize);

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));

        return result;
    }

    public async Task<CourseDto?> GetCourseByIdAsync(int courseId)
    {
        var cacheKey = $"{CacheKeyPrefix}detail_{courseId}";

        if (_cache.TryGetValue(cacheKey, out CourseDto? cached) && cached != null)
            return cached;

        var course = await _unitOfWork.Courses.Query()
            .Where(c => c.CourseId == courseId)
            .Select(c => new CourseDto
            {
                CourseId = c.CourseId,
                Name = c.Name,
                Description = c.Description,
                OrderIndex = c.OrderIndex,
                LessonCount = c.Lessons.Count(l => !l.IsDeleted)
            })
            .FirstOrDefaultAsync();

        if (course != null)
            _cache.Set(cacheKey, course, TimeSpan.FromMinutes(30));

        return course;
    }

    public async Task<CourseDto> CreateAsync(CourseCreateDto dto)
    {
        var course = new JLearn.Models.Course
        {
            Name = dto.Name,
            Description = dto.Description,
            OrderIndex = dto.OrderIndex
        };
        await _unitOfWork.Courses.AddAsync(course);
        await _unitOfWork.SaveChangesAsync();

        return new CourseDto
        {
            CourseId = course.CourseId,
            Name = course.Name,
            Description = course.Description,
            OrderIndex = course.OrderIndex,
            LessonCount = 0
        };
    }

    public async Task<CourseDto> UpdateAsync(int courseId, CourseUpdateDto dto)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
        if (course == null) throw new KeyNotFoundException("Course not found");

        course.Name = dto.Name;
        course.Description = dto.Description;
        course.OrderIndex = dto.OrderIndex;

        _unitOfWork.Courses.Update(course);
        await _unitOfWork.SaveChangesAsync();

        return new CourseDto
        {
            CourseId = course.CourseId,
            Name = course.Name,
            Description = course.Description,
            OrderIndex = course.OrderIndex,
            LessonCount = course.Lessons?.Count(l => !l.IsDeleted) ?? 0
        };
    }

    public async Task<bool> DeleteAsync(int courseId)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
        if (course == null) return false;

        course.IsDeleted = true;
        _unitOfWork.Courses.Update(course);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
