using JLearn.Data;
using JLearn.Models;
using JLearn.Repositories;
using JLearn.Repositories.Interfaces;

namespace JLearn.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private IGenericRepository<User>? _users;
    private IGenericRepository<Course>? _courses;
    private IGenericRepository<Lesson>? _lessons;
    private IGenericRepository<Vocabulary>? _vocabularies;
    private IGenericRepository<Grammar>? _grammars;
    private IGenericRepository<Question>? _questions;
    private IGenericRepository<UserVocabulary>? _userVocabularies;
    private IGenericRepository<QuizResult>? _quizResults;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<User> Users =>
        _users ??= new GenericRepository<User>(_context);

    public IGenericRepository<Course> Courses =>
        _courses ??= new GenericRepository<Course>(_context);

    public IGenericRepository<Lesson> Lessons =>
        _lessons ??= new GenericRepository<Lesson>(_context);

    public IGenericRepository<Vocabulary> Vocabularies =>
        _vocabularies ??= new GenericRepository<Vocabulary>(_context);

    public IGenericRepository<Grammar> Grammars =>
        _grammars ??= new GenericRepository<Grammar>(_context);

    public IGenericRepository<Question> Questions =>
        _questions ??= new GenericRepository<Question>(_context);

    public IGenericRepository<UserVocabulary> UserVocabularies =>
        _userVocabularies ??= new GenericRepository<UserVocabulary>(_context);

    public IGenericRepository<QuizResult> QuizResults =>
        _quizResults ??= new GenericRepository<QuizResult>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
