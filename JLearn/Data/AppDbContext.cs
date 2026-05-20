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
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Vocabulary> Vocabularies => Set<Vocabulary>();
    public DbSet<Grammar> Grammars => Set<Grammar>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<UserVocabulary> UserVocabularies => Set<UserVocabulary>();
    public DbSet<QuizResult> QuizResults => Set<QuizResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // === User ===
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // === Course ===
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasMany(c => c.Lessons)
                .WithOne(l => l.Course)
                .HasForeignKey(l => l.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // === Lesson ===
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasMany(l => l.Vocabularies)
                .WithOne(v => v.Lesson)
                .HasForeignKey(v => v.LessonId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(l => l.Grammars)
                .WithOne(g => g.Lesson)
                .HasForeignKey(g => g.LessonId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(l => l.Questions)
                .WithOne(q => q.Lesson)
                .HasForeignKey(q => q.LessonId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(l => l.QuizResults)
                .WithOne(qr => qr.Lesson)
                .HasForeignKey(qr => qr.LessonId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // === UserVocabulary (Composite PK) ===
        modelBuilder.Entity<UserVocabulary>(entity =>
        {
            entity.HasKey(uv => new { uv.UserId, uv.VocabId });

            entity.HasOne(uv => uv.User)
                .WithMany(u => u.UserVocabularies)
                .HasForeignKey(uv => uv.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uv => uv.Vocabulary)
                .WithMany(v => v.UserVocabularies)
                .HasForeignKey(uv => uv.VocabId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // === QuizResult ===
        modelBuilder.Entity<QuizResult>(entity =>
        {
            entity.HasOne(qr => qr.User)
                .WithMany(u => u.QuizResults)
                .HasForeignKey(qr => qr.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // === Global Query Filters (Soft Delete) ===
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Course>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Lesson>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Vocabulary>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Grammar>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Question>().HasQueryFilter(e => !e.IsDeleted);
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
