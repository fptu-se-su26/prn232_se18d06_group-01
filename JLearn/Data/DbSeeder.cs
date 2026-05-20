using JLearn.Models;
using Microsoft.EntityFrameworkCore;

namespace JLearn.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Only seed if no data exists
        if (await context.Courses.AnyAsync())
            return;

        // ===== Courses =====
        var courseN5 = new Course { Name = "JLPT N5", Description = "Khóa học tiếng Nhật trình độ N5 - Cơ bản", OrderIndex = 1 };
        var courseN4 = new Course { Name = "JLPT N4", Description = "Khóa học tiếng Nhật trình độ N4 - Sơ trung cấp", OrderIndex = 2 };

        context.Courses.AddRange(courseN5, courseN4);
        await context.SaveChangesAsync();

        // ===== Lessons (Minna no Nihongo) =====
        var lesson1 = new Lesson { CourseId = courseN5.CourseId, Title = "Bài 1: わたしは マイク・ミラーです", Description = "Giới thiệu bản thân, quốc tịch, nghề nghiệp", OrderIndex = 1 };
        var lesson2 = new Lesson { CourseId = courseN5.CourseId, Title = "Bài 2: これは 本です", Description = "Đồ vật, chỉ thị đại từ これ/それ/あれ", OrderIndex = 2 };
        var lesson3 = new Lesson { CourseId = courseN5.CourseId, Title = "Bài 3: ここは 食堂です", Description = "Địa điểm, chỉ thị đại từ ここ/そこ/あそこ", OrderIndex = 3 };
        var lesson4 = new Lesson { CourseId = courseN5.CourseId, Title = "Bài 4: 今 何時ですか", Description = "Thời gian, ngày tháng, số đếm", OrderIndex = 4 };

        context.Lessons.AddRange(lesson1, lesson2, lesson3, lesson4);
        await context.SaveChangesAsync();

        // ===== Vocabularies - Bài 1 =====
        var vocabsLesson1 = new List<Vocabulary>
        {
            new() { LessonId = lesson1.LessonId, Kanji = "私", Kana = "わたし", Meaning = "Tôi", Romaji = "watashi" },
            new() { LessonId = lesson1.LessonId, Kanji = null, Kana = "あなた", Meaning = "Bạn, anh, chị", Romaji = "anata" },
            new() { LessonId = lesson1.LessonId, Kanji = "先生", Kana = "せんせい", Meaning = "Giáo viên, thầy/cô", Romaji = "sensei" },
            new() { LessonId = lesson1.LessonId, Kanji = "学生", Kana = "がくせい", Meaning = "Sinh viên", Romaji = "gakusei" },
            new() { LessonId = lesson1.LessonId, Kanji = "会社員", Kana = "かいしゃいん", Meaning = "Nhân viên công ty", Romaji = "kaishain" },
            new() { LessonId = lesson1.LessonId, Kanji = "医者", Kana = "いしゃ", Meaning = "Bác sĩ", Romaji = "isha" },
            new() { LessonId = lesson1.LessonId, Kanji = "銀行員", Kana = "ぎんこういん", Meaning = "Nhân viên ngân hàng", Romaji = "ginkouin" },
            new() { LessonId = lesson1.LessonId, Kanji = "研究者", Kana = "けんきゅうしゃ", Meaning = "Nhà nghiên cứu", Romaji = "kenkyuusha" },
            new() { LessonId = lesson1.LessonId, Kanji = "大学", Kana = "だいがく", Meaning = "Đại học", Romaji = "daigaku" },
            new() { LessonId = lesson1.LessonId, Kanji = "病院", Kana = "びょういん", Meaning = "Bệnh viện", Romaji = "byouin" },
            new() { LessonId = lesson1.LessonId, Kanji = "名前", Kana = "なまえ", Meaning = "Tên", Romaji = "namae" },
            new() { LessonId = lesson1.LessonId, Kanji = "何歳", Kana = "なんさい", Meaning = "Bao nhiêu tuổi", Romaji = "nansai" },
        };

        // ===== Vocabularies - Bài 2 =====
        var vocabsLesson2 = new List<Vocabulary>
        {
            new() { LessonId = lesson2.LessonId, Kanji = "本", Kana = "ほん", Meaning = "Sách", Romaji = "hon" },
            new() { LessonId = lesson2.LessonId, Kanji = "辞書", Kana = "じしょ", Meaning = "Từ điển", Romaji = "jisho" },
            new() { LessonId = lesson2.LessonId, Kanji = "雑誌", Kana = "ざっし", Meaning = "Tạp chí", Romaji = "zasshi" },
            new() { LessonId = lesson2.LessonId, Kanji = "新聞", Kana = "しんぶん", Meaning = "Báo", Romaji = "shinbun" },
            new() { LessonId = lesson2.LessonId, Kanji = "鍵", Kana = "かぎ", Meaning = "Chìa khóa", Romaji = "kagi" },
            new() { LessonId = lesson2.LessonId, Kanji = "時計", Kana = "とけい", Meaning = "Đồng hồ", Romaji = "tokei" },
            new() { LessonId = lesson2.LessonId, Kanji = "傘", Kana = "かさ", Meaning = "Ô, dù", Romaji = "kasa" },
            new() { LessonId = lesson2.LessonId, Kanji = null, Kana = "かばん", Meaning = "Cặp, túi xách", Romaji = "kaban" },
            new() { LessonId = lesson2.LessonId, Kanji = null, Kana = "テレビ", Meaning = "Ti vi", Romaji = "terebi" },
            new() { LessonId = lesson2.LessonId, Kanji = null, Kana = "ラジオ", Meaning = "Radio", Romaji = "rajio" },
            new() { LessonId = lesson2.LessonId, Kanji = null, Kana = "カメラ", Meaning = "Máy ảnh", Romaji = "kamera" },
            new() { LessonId = lesson2.LessonId, Kanji = null, Kana = "コンピューター", Meaning = "Máy tính", Romaji = "konpyuutaa" },
        };

        context.Vocabularies.AddRange(vocabsLesson1);
        context.Vocabularies.AddRange(vocabsLesson2);
        await context.SaveChangesAsync();

        // ===== Grammars - Bài 1 =====
        var grammarsLesson1 = new List<Grammar>
        {
            new()
            {
                LessonId = lesson1.LessonId,
                Structure = "N1 は N2 です",
                Explanation = "N1 là N2. Trợ từ は đánh dấu chủ đề, です là trợ động từ khẳng định.",
                Example = "わたしは がくせいです。(Tôi là sinh viên.)",
                Note = "は đọc là 'wa' khi là trợ từ chủ đề"
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Structure = "N1 は N2 じゃありません",
                Explanation = "N1 không phải là N2. Thể phủ định của です.",
                Example = "わたしは せんせいじゃありません。(Tôi không phải là giáo viên.)",
                Note = "じゃありません = ではありません (lịch sự hơn)"
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Structure = "N1 は N2 ですか",
                Explanation = "N1 có phải là N2 không? Thêm か vào cuối câu để tạo câu hỏi.",
                Example = "ミラーさんは アメリカじんですか。(Anh Miller là người Mỹ phải không?)",
                Note = null
            },
        };

        // ===== Grammars - Bài 2 =====
        var grammarsLesson2 = new List<Grammar>
        {
            new()
            {
                LessonId = lesson2.LessonId,
                Structure = "これ/それ/あれ は N です",
                Explanation = "Đại từ chỉ thị vật. これ (cái này - gần người nói), それ (cái đó - gần người nghe), あれ (cái kia - xa cả hai).",
                Example = "これは ほんです。(Đây là quyển sách.)",
                Note = null
            },
            new()
            {
                LessonId = lesson2.LessonId,
                Structure = "この/その/あの N",
                Explanation = "Đi kèm danh từ để chỉ định vật cụ thể. この (N này), その (N đó), あの (N kia).",
                Example = "この かばんは わたしのです。(Cái cặp này là của tôi.)",
                Note = "Khác với これ/それ/あれ, この/その/あの luôn đi kèm danh từ"
            },
        };

        context.Grammars.AddRange(grammarsLesson1);
        context.Grammars.AddRange(grammarsLesson2);
        await context.SaveChangesAsync();

        // ===== Questions - Bài 1 =====
        var questionsLesson1 = new List<Question>
        {
            new()
            {
                LessonId = lesson1.LessonId,
                Content = "「わたし」の意味は何ですか。(Nghĩa của 「わたし」 là gì?)",
                OptionA = "Bạn", OptionB = "Tôi", OptionC = "Anh ấy", OptionD = "Cô ấy",
                CorrectAnswer = "B",
                Explanation = "わたし (私) có nghĩa là 'Tôi'"
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Content = "「せんせい」を漢字で書くと？ (Viết bằng Kanji thì 「せんせい」 là gì?)",
                OptionA = "学生", OptionB = "会社員", OptionC = "先生", OptionD = "医者",
                CorrectAnswer = "C",
                Explanation = "せんせい viết bằng Kanji là 先生 (Giáo viên)"
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Content = "Chọn câu đúng ngữ pháp:",
                OptionA = "わたしは がくせいです", OptionB = "わたしが がくせいです", OptionC = "わたしを がくせいです", OptionD = "わたしに がくせいです",
                CorrectAnswer = "A",
                Explanation = "Cấu trúc đúng: N1 は N2 です. Trợ từ は dùng để đánh dấu chủ đề."
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Content = "「いしゃ」の意味は何ですか。(Nghĩa của 「いしゃ」 là gì?)",
                OptionA = "Kỹ sư", OptionB = "Sinh viên", OptionC = "Nhân viên", OptionD = "Bác sĩ",
                CorrectAnswer = "D",
                Explanation = "いしゃ (医者) có nghĩa là 'Bác sĩ'"
            },
            new()
            {
                LessonId = lesson1.LessonId,
                Content = "Điền vào chỗ trống: わたしは せんせい＿＿＿。(Tôi không phải là giáo viên.)",
                OptionA = "です", OptionB = "じゃありません", OptionC = "ですか", OptionD = "でした",
                CorrectAnswer = "B",
                Explanation = "じゃありません là thể phủ định hiện tại của です"
            },
        };

        // ===== Questions - Bài 2 =====
        var questionsLesson2 = new List<Question>
        {
            new()
            {
                LessonId = lesson2.LessonId,
                Content = "「ほん」を漢字で書くと？ (「ほん」viết bằng Kanji là gì?)",
                OptionA = "木", OptionB = "本", OptionC = "体", OptionD = "休",
                CorrectAnswer = "B",
                Explanation = "ほん viết bằng Kanji là 本 (Sách)"
            },
            new()
            {
                LessonId = lesson2.LessonId,
                Content = "Vật ở gần người nói dùng từ nào?",
                OptionA = "それ", OptionB = "あれ", OptionC = "これ", OptionD = "どれ",
                CorrectAnswer = "C",
                Explanation = "これ dùng cho vật ở gần người nói, それ gần người nghe, あれ xa cả hai"
            },
            new()
            {
                LessonId = lesson2.LessonId,
                Content = "「じしょ」の意味は何ですか。(Nghĩa của 「じしょ」 là gì?)",
                OptionA = "Tạp chí", OptionB = "Báo", OptionC = "Sách", OptionD = "Từ điển",
                CorrectAnswer = "D",
                Explanation = "じしょ (辞書) có nghĩa là 'Từ điển'"
            },
            new()
            {
                LessonId = lesson2.LessonId,
                Content = "Điền vào chỗ trống: ＿＿ かばんは わたしのです。(Cái cặp này là của tôi.)",
                OptionA = "これ", OptionB = "この", OptionC = "それ", OptionD = "あの",
                CorrectAnswer = "B",
                Explanation = "この đi kèm danh từ (この + N), còn これ đứng một mình"
            },
            new()
            {
                LessonId = lesson2.LessonId,
                Content = "「テレビ」の意味は何ですか。",
                OptionA = "Radio", OptionB = "Máy ảnh", OptionC = "Ti vi", OptionD = "Máy tính",
                CorrectAnswer = "C",
                Explanation = "テレビ (terebi) là từ mượn tiếng Anh 'television' - nghĩa là Ti vi"
            },
        };

        context.Questions.AddRange(questionsLesson1);
        context.Questions.AddRange(questionsLesson2);
        await context.SaveChangesAsync();

        // ===== Admin User =====
        var admin = new User
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
