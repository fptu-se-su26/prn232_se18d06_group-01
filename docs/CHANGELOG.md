# 📜 Changelog — Lịch sử Thay đổi

> File này ghi lại các thay đổi quan trọng theo từng phiên làm việc.
> Format theo [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Planned
- Phase 4: Frontend React + Vite + Tailwind CSS
- Phase 5: Flashcard 3D, Quiz UI, Dashboard
- Phase 6: Admin CMS + Deployment

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
