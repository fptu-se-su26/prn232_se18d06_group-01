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

        // Seed some public decks under admin (userId: admin.UserId) to show in community section
        if (admin != null)
        {
            var hasDecks = await context.CustomDecks.AnyAsync(d => d.UserId == admin.UserId);
            if (!hasDecks)
            {
                var deck1 = new CustomDeck
                {
                    UserId = admin.UserId,
                    Name = "Từ vựng N5 cơ bản",
                    Description = "Bộ thẻ tổng hợp 100+ từ vựng tiếng Nhật trình độ N5 phổ biến nhất cho người mới bắt đầu.",
                    IsPublic = true,
                    CreatedAt = DateTime.UtcNow,
                    CustomCards = new List<CustomCard>
                    {
                        new CustomCard { Word = "こんにちは (Konnichiwa)", Meaning = "Xin chào (vào ban ngày)" },
                        new CustomCard { Word = "ありがとう (Arigatou)", Meaning = "Cảm ơn" },
                        new CustomCard { Word = "はい (Hai)", Meaning = "Vâng, đúng vậy" },
                        new CustomCard { Word = "いいえ (Iie)", Meaning = "Không, không phải" },
                        new CustomCard { Word = "さようなら (Sayounara)", Meaning = "Tạm biệt" },
                        new CustomCard { Word = "たべる (Taberu)", Meaning = "Ăn (động từ)" },
                        new CustomCard { Word = "のむ (Nomu)", Meaning = "Uống (động từ)" }
                    }
                };

                var deck2 = new CustomDeck
                {
                    UserId = admin.UserId,
                    Name = "Giao tiếp hàng ngày",
                    Description = "Các mẫu câu giao tiếp ngắn, lịch sự thường dùng trong đời sống hàng ngày tại Nhật Bản.",
                    IsPublic = true,
                    CreatedAt = DateTime.UtcNow,
                    CustomCards = new List<CustomCard>
                    {
                        new CustomCard { Word = "お元気ですか (O-genki desu ka?)", Meaning = "Bạn có khỏe không?" },
                        new CustomCard { Word = "すみません (Sumimasen)", Meaning = "Xin lỗi / Xin hỏi (dùng để thu hút sự chú ý hoặc xin lỗi nhẹ)" },
                        new CustomCard { Word = "いただきます (Itadakimasu)", Meaning = "Chúc ngon miệng / Tôi xin nhận bữa ăn (nói trước khi ăn)" },
                        new CustomCard { Word = "ごちそうさまでした (Gochisousama deshita)", Meaning = "Cảm ơn vì bữa ăn ngon (nói sau khi ăn xong)" },
                        new CustomCard { Word = "はじめまして (Hajimemashite)", Meaning = "Rất hân hạnh được gặp bạn (nói khi lần đầu gặp mặt)" }
                    }
                };

                var deck3 = new CustomDeck
                {
                    UserId = admin.UserId,
                    Name = "Từ vựng N4 thông dụng",
                    Description = "Bộ từ vựng chuẩn bị cho kỳ thi JLPT N4, tập trung vào động từ nhóm và danh từ ghép.",
                    IsPublic = true,
                    CreatedAt = DateTime.UtcNow,
                    CustomCards = new List<CustomCard>
                    {
                        new CustomCard { Word = "準備 (じゅんび - Junbi)", Meaning = "Chuẩn bị" },
                        new CustomCard { Word = "約束 (やくそく - Yakusoku)", Meaning = "Hứa, lời hứa, cuộc hẹn" },
                        new CustomCard { Word = "連絡 (れんらく - Renlak)", Meaning = "Liên lạc" },
                        new CustomCard { Word = "相談 (そうだん - Soudan)", Meaning = "Thảo luận, bàn bạc, tư vấn" },
                        new CustomCard { Word = "注意 (ちゅうい - Chuui)", Meaning = "Chú ý, nhắc nhở" }
                    }
                };

                context.CustomDecks.AddRange(deck1, deck2, deck3);
                await context.SaveChangesAsync();
            }
        }
    }
}
