# 📜 Changelog — Lịch sử Thay đổi

> File này ghi lại các thay đổi quan trọng theo từng phiên làm việc.
> Format theo [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-06-15

### Added — Phase 6, Public Decks & Clone Functionality
- Triển khai toàn bộ hệ thống **Custom Decks (Bộ thẻ tự chọn)** và **Custom Cards (Thẻ từ)**: Cho phép người dùng tự tạo bộ thẻ học và thẻ từ vựng của riêng mình thay vì đi theo lộ trình bài học cố định.
- Tích hợp tính năng **Public Decks**: Người dùng có thể đánh dấu bộ thẻ của mình là công khai (`IsPublic = true`).
- Tích hợp tính năng **Clone Decks**: Cho phép người dùng sao chép (clone) bộ thẻ công khai của người khác thành bộ thẻ cá nhân của mình để tự học và chỉnh sửa.
- Tích hợp tính năng **CSV Import**: Nâng cấp phương thức import cho phép dán hoặc nhập dữ liệu dạng CSV tiêu chuẩn (hỗ trợ dấu phẩy hoặc nháy kép) để nhập thẻ hàng loạt.
- Xây dựng giao diện **Học tự do (Free Study)** chuyên nghiệp với component **3D Flashcard** hỗ trợ lật thẻ bằng nút hoặc phím tắt (`Space` để lật, `←/A` thẻ trước, `→/D` thẻ sau).
- Khởi tạo tài khoản Admin mặc định thứ hai (`admin@test.com` / `123`).

### Changed, Cleaned Up & Removed SM-2 Spaced Repetition
- **Loại bỏ hoàn toàn thuật toán Spaced Repetition (SM-2)**: Gỡ bỏ toàn bộ các trường `EaseFactor`, `Repetitions`, `IntervalDays`, `NextReviewDate` khỏi thực thể `CustomCard`, DTOs và cơ sở dữ liệu (qua migration `RemoveSrsFields`).
- Loại bỏ toàn bộ các thực thể, API controller, service và DTOs liên quan đến `Courses`, `Lessons`, `Vocabularies`, `Grammars`, `QuizResults` để tối ưu hóa dự án, tập trung 100% vào tính năng Custom Decks học tự do.
- Dọn dẹp toàn bộ file frontend không còn sử dụng (như các trang Admin cũ, QuizPage, ReviewQueuePage, CustomReviewPage) để loại bỏ hoàn toàn code chết (dead code).
- Thực hiện kiểm toán dự án và cập nhật tài liệu báo cáo kiểm toán chi tiết tại [PROJECT_AUDIT.md](file:///c:/Users/anhqu/source/repos/prn232_se18d06_group-01/docs/PROJECT_AUDIT.md).


---

## [0.4.0] — 2026-05-22

### Added — Phase 4 & 5: Frontend React (Subagent Concurrent Execution)
- Khởi tạo dự án `jlearn-frontend` với React + Vite + TypeScript.
- Tích hợp và cấu hình **Tailwind CSS 4** (pure CSS framework, không UI library).
- Thiết lập `Axios` instance với interceptors để gán JWT token và tự động xử lý refresh token (`401 Unauthorized`).
- Xây dựng `AuthContext` quản lý state người dùng.
- Base Layout hiện đại (Sidebar + Header) với responsive design và glassmorphism.
- **[Subagent 1]** Giao diện Danh sách Khóa học (`CoursesPage`) và Chi tiết Bài học (`LessonDetailPage`).
- **[Subagent 2]** Giao diện Bài kiểm tra (`QuizPage`) kết nối API chấm điểm.
- **[Subagent 3]** Giao diện Ôn tập SRS (`ReviewQueuePage`) và component thẻ lật 3D (`Flashcard`).

---

## [0.3.0] — 2026-05-22

### Added — Phase 3: Spaced Repetition & Quiz APIs
- Khắc phục triệt để lỗi môi trường .NET Runtime bằng cách tích hợp `<RollForward>Major</RollForward>` vào `JLearn.csproj`
- Hoàn tất DI Registration trong `Program.cs` cho `ISpacedRepetitionService`
- Thiết lập và áp dụng EF Core Migration `AddSpacedRepetitionFields` đồng bộ các trường SM-2 (`EaseFactor`, `Repetitions`, `IntervalDays`) cho mapping table `UserVocabularies`
- `QuizController` — 2 endpoints cho Quiz (`GET api/quizzes/lesson/{lessonId}`, `POST api/quizzes/submit` với server-side grading)
- `TrackingController` — 2 endpoints cho Spaced Repetition (`GET api/tracking/reviews` tìm từ vựng cần học, `POST api/tracking/review` thực thi thuật toán SM-2 cập nhật lịch ôn tập)

---

## [0.2.0] — 2026-05-20

### Added — Phase 2: Authentication & Core APIs
- JWT Authentication (Register, Login, Refresh Token)
- `JwtHelper` — generate/validate Access Token & Refresh Token
- `AuthController` — 3 endpoints (register, login, refresh-token)
- `CoursesController` — GET courses (pagination), GET course detail, GET lessons by course
- `LessonsController` — GET lesson detail, GET vocabularies, GET grammars
- `CourseService` & `LessonService` — business logic với In-Memory Cache
- Auth DTOs (RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto)
- Content DTOs (CourseDto, LessonDto, VocabularyDto, GrammarDto)
- Swagger UI với JWT Bearer support
- Seed data: Minna no Nihongo Bài 1-2 (24 từ vựng, 5 ngữ pháp, 10 câu hỏi)
- Admin account seed: `admin@jlearn.com`

---

## [0.1.0] — 2026-05-20

### Added — Phase 1: Foundation (Backend & Database)
- Project setup: .NET 8 Web API
- Entity Models: User, Course, Lesson, Vocabulary, Grammar, Question, UserVocabulary, QuizResult
- `BaseEntity` abstract class (CreatedAt, UpdatedAt, IsDeleted)
- `AppDbContext` — EF Core DbContext với Fluent API configurations
- Global Query Filter cho Soft Delete
- `GenericRepository<T>` + `IUnitOfWork` (Repository Pattern + Unit of Work)
- `ApiResponse<T>` — Wrapped JSON response chuẩn
- `PaginatedList<T>` — Pagination helper
- `ExceptionMiddleware` — Global exception handling
- EF Core Migration `InitialCreate` — tạo 8 bảng database
- SQL Server Docker container (`jlearn-db`)
- NuGet packages: EF Core, JWT Bearer, BCrypt, AutoMapper
- CORS configuration cho React frontend (localhost:5173)

### Infrastructure
- `.gitignore` cho .NET project
- Git repository initialized
- Branch structure: main, develop, feature/*
- `docs/` — AI audit documentation (AI_AUDIT_LOG, PROMPTS, REFLECTION, CHANGELOG)
