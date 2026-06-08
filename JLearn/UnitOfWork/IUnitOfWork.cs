using JLearn.Models;
using JLearn.Repositories.Interfaces;

namespace JLearn.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<CustomDeck> CustomDecks { get; }
    IGenericRepository<CustomCard> CustomCards { get; }
    Task<int> SaveChangesAsync();
}
