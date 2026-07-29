using JLearn.Models;
using JLearn.Models.Base;
using Microsoft.EntityFrameworkCore;

namespace JLearn.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<CustomDeck> CustomDecks => Set<CustomDeck>();
    public DbSet<CustomCard> CustomCards => Set<CustomCard>();
    public DbSet<QuizResult> QuizResults => Set<QuizResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // === User ===
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });



        // === CustomDeck ===
        modelBuilder.Entity<CustomDeck>(entity =>
        {
            entity.HasMany(d => d.CustomCards)
                .WithOne(c => c.CustomDeck)
                .HasForeignKey(c => c.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.User)
                .WithMany(u => u.CustomDecks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // === QuizResult ===
        modelBuilder.Entity<QuizResult>(entity =>
        {
            entity.HasOne(q => q.CustomDeck)
                .WithMany()
                .HasForeignKey(q => q.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(q => q.User)
                .WithMany()
                .HasForeignKey(q => q.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // === Global Query Filters (Soft Delete) ===
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CustomDeck>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CustomCard>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<QuizResult>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
