using JLearn.Models;
using Microsoft.EntityFrameworkCore;

namespace JLearn.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Ensure test admin exists
        var testAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@test.com");
        if (testAdmin == null)
        {
            testAdmin = new User
            {
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
                FullName = "Admin JLearn",
                Role = UserRole.Admin
            };
            context.Users.Add(testAdmin);
            await context.SaveChangesAsync();
        }

        // ===== Admin User =====
        var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@jlearn.com");
        if (admin == null)
        {
            admin = new User
            {
                Email = "admin@jlearn.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "Admin JLearn",
                Role = UserRole.Admin
            };
            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
