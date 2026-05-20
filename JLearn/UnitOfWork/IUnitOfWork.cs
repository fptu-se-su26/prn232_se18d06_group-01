using JLearn.Models;
using JLearn.Repositories.Interfaces;

namespace JLearn.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<Course> Courses { get; }
    IGenericRepository<Lesson> Lessons { get; }
    IGenericRepository<Vocabulary> Vocabularies { get; }
    IGenericRepository<Grammar> Grammars { get; }
    IGenericRepository<Question> Questions { get; }
    IGenericRepository<UserVocabulary> UserVocabularies { get; }
    IGenericRepository<QuizResult> QuizResults { get; }
    Task<int> SaveChangesAsync();
}
