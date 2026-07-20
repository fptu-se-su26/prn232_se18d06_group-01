using JLearn.Data;
using JLearn.Models;
using JLearn.Repositories;
using JLearn.Repositories.Interfaces;

namespace JLearn.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private IGenericRepository<User>? _users;

    private IGenericRepository<CustomDeck>? _customDecks;
    private IGenericRepository<CustomCard>? _customCards;
    private IGenericRepository<QuizResult>? _quizResults;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<User> Users =>
        _users ??= new GenericRepository<User>(_context);



    public IGenericRepository<CustomDeck> CustomDecks =>
        _customDecks ??= new GenericRepository<CustomDeck>(_context);

    public IGenericRepository<CustomCard> CustomCards =>
        _customCards ??= new GenericRepository<CustomCard>(_context);

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
