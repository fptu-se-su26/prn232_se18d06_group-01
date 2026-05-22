# 📋 AI Audit Log — Nhật ký Sử dụng AI

> File này ghi lại **toàn bộ** quá trình sử dụng AI (ChatGPT, Copilot, Gemini, Claude, v.v.) trong dự án.
> Mỗi lần sử dụng AI cần ghi đầy đủ: prompt, kết quả, phần đã dùng, phần đã chỉnh sửa, và minh chứng.

---

## Hướng dẫn ghi log

Mỗi entry sử dụng format sau:

```markdown
### [Ngày] — [Mô tả ngắn]

- **Người thực hiện**: [Tên]
- **Công cụ AI**: [ChatGPT / Copilot / Gemini / Claude / ...]
- **Prompt**: [Nội dung prompt đã gửi cho AI]
- **Kết quả AI gợi ý**: [Tóm tắt kết quả AI trả về]
- **Phần đã sử dụng**: [Phần nào từ kết quả AI được giữ nguyên]
- **Phần đã chỉnh sửa**: [Phần nào đã sửa đổi so với gợi ý AI, lý do]
- **Minh chứng**: [Link commit, screenshot, hoặc diff]
- **File liên quan**: [Danh sách file bị ảnh hưởng]
```

---

## Log Entries

### 2026-05-20 — Khởi tạo dự án: Phase 1 & 2 (Foundation + Auth + Core APIs)

- **Người thực hiện**: Nguyễn Hồ Anh Quân
- **Công cụ AI**: Gemini (Antigravity Agent)
- **Prompt**: 
  > 1. [Nội dung SRS] Đánh giá dự án này đã oke để bắt đầu làm chưa
  > 2. gợi ý các giải pháp thích hợp cho các câu hỏi của bạn
  > 3. okay giờ xuất lại 1 file kế hoạch chuẩn trước , chưa code vội
  > 4. tiếp tục phase 2 đi
- **Kết quả AI gợi ý**:
  - Đánh giá SRS, đề xuất 5 quyết định thiết kế (inline OptionA-D, Global Query Filter, In-Memory Cache, v.v.)
  - Tạo Implementation Plan chi tiết 6 phase
  - Generate toàn bộ code Phase 1: Models, DbContext, Repository, UoW, Middleware
  - Generate toàn bộ code Phase 2: JWT Auth, Controllers, Services, DTOs, Seed Data
- **Phần đã sử dụng**: Toàn bộ code foundation (Models, DbContext, Repository Pattern, DTOs, Middleware)
- **Phần đã chỉnh sửa**: *(Ghi lại các phần đã chỉnh sửa thủ công nếu có)*
- **Minh chứng**: Commit `79549fd` — `feat: Phase 1 & 2 - Foundation, Auth, Core APIs`
- **File liên quan**:
  - `Models/` (9 entity files)
  - `Data/AppDbContext.cs`, `Data/DbSeeder.cs`
  - `Controllers/` (AuthController, CoursesController, LessonsController)
  - `Services/` (AuthService, CourseService, LessonService)
  - `Repositories/`, `UnitOfWork/`, `DTOs/`, `Middleware/`, `Helpers/`

### 2026-05-22 — Hoàn thành Phase 3: Spaced Repetition & Quiz APIs

- **Người thực hiện**: Nguyễn Hồ Anh Quân
- **Công cụ AI**: Gemini (Antigravity Agent)
- **Prompt**:
  > /Users/nguyenhoanhquan/RiderProjects/JLearn/JLearn/bin/Debug/net8.0/JLearn
  > You must install or update .NET to run this application.
  > ... (Error log about missing runtime version 8.0.0, only 10.0.1 found)
- **Kết quả AI gợi ý**:
  - Khắc phục lỗi runtime bằng cách thêm cấu hình `<RollForward>Major</RollForward>` vào `JLearn.csproj`, cho phép chạy ứng dụng net8.0 trên môi trường chỉ có .NET 10 runtime.
  - Hoàn tất DI registration trong `Program.cs` cho `ISpacedRepetitionService`.
  - Tạo EF Core Migration mới `AddSpacedRepetitionFields` chứa các trường SM-2 thuật toán (`EaseFactor`, `Repetitions`, `IntervalDays`) cho `UserVocabulary`, và áp dụng thành công vào Database.
  - Tạo `TrackingController.cs` cung cấp 2 endpoints chính: `GET api/tracking/reviews` (danh sách từ vựng đến hạn ôn tập) và `POST api/tracking/review` (nộp kết quả ôn tập SM-2).
- **Phần đã sử dụng**: Toàn bộ cấu hình csproj, DI, Migration, và code trong `TrackingController.cs`.
- **Phần đã chỉnh sửa**: Không có chỉnh sửa thủ công nào khác, mọi thành phần biên dịch 100% thành công không có lỗi/cảnh báo.
- **Minh chứng**: Hoạt động thành công qua CLI build & run, database update.
- **File liên quan**:
  - `JLearn.csproj`
  - `Program.cs`
  - `Controllers/TrackingController.cs`
  - `Migrations/` (Migration files cho Spaced Repetition fields)
