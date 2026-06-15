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

### 2026-05-22 — Khởi tạo Frontend & Tích hợp tính năng: Phase 4 & 5

- **Người thực hiện**: Nguyễn Hồ Anh Quân
- **Công cụ AI**: Gemini (Antigravity Agent + 3 Subagents)
- **Prompt**:
  > "thuần tailwind css , thực hiện đi" (và trước đó: "giờ thực hiện phase 4 cho tôi , gọi các subagent để hoàn thành phase 4,5 luôn")
- **Kết quả AI gợi ý**:
  - Tự động thiết lập React + Vite + TypeScript.
  - Cấu hình Tailwind CSS v4, Axios với interceptors (refresh token), và React Router.
  - Xây dựng Layout, Login, Dashboard (Phase 4).
  - Phân công 3 Subagents chạy song song để phát triển:
    - **Subagent 1**: Courses Page & Lesson Detail Page (Grid, layout 2 cột, API integration).
    - **Subagent 2**: Quiz Page (Glassmorphism, chấm điểm trực tiếp, API quizzes).
    - **Subagent 3**: Review Queue Page & Flashcard Component (3D flip animation, API tracking/reviews).
- **Phần đã sử dụng**: Toàn bộ codebase frontend được tạo ra và các component từ subagents.
- **Phần đã chỉnh sửa**: Cập nhật lại đường dẫn API client trong các component của Subagent 1 để tuân thủ thiết kế Axios interceptor thay vì dùng `fetch` thuần. Đã fix lỗi duplicate import trong `App.tsx`.
- **Minh chứng**: Thư mục `jlearn-frontend` đã cấu hình thành công, có thể chạy bằng `npm run dev`.
- **File liên quan**:
  - `jlearn-frontend/*` (Toàn bộ source code frontend mới được sinh ra)

### 2026-06-15 — Hoàn thành Phase 6 & SRS Custom Decks Pivot, Dọn dẹp Nhánh & Kiểm toán Dự án

- **Người thực hiện**: Nguyễn Hồ Anh Quân
- **Công cụ AI**: Gemini (Antigravity Agent)
- **Prompt**:
  > 1. Kiểm tra dự án này xem đã có fe chưa
  > 2. origin/feature/spaced-repetition mergre cái này vào các nhánh khác luôn đi và dọn dẹp , giờ tất cả các nhánh sẽ như nhánh trên
  > 3. làm 1 file audit lại dự án cho tôi
- **Kết quả AI gợi ý**:
  - Phát hiện và kiểm tra cấu trúc front-end tồn tại trên nhánh remote `feature/spaced-repetition`.
  - Thực hiện đồng bộ hóa toàn bộ nhánh `main` và `develop` bằng cách hard reset về commit mới nhất từ `spaced-repetition` (`8a82790`) và push lên Git remote server.
  - Dọn dẹp (xóa) 5 nhánh remote cũ lỗi thời (`docs/setup-project-docs`, `feature/admin-cms`, `feature/frontend-base`, `feature/quiz`, `feature/spaced-repetition`).
  - Viết tài liệu báo cáo kiểm toán chi tiết `docs/PROJECT_AUDIT.md` ghi nhận toàn bộ cấu trúc hệ thống backend/frontend, cơ chế thuật toán Spaced Repetition (SM-2) và các cảnh báo nợ kỹ thuật (Technical Debt).
  - Cập nhật tài liệu `docs/CHANGELOG.md` và `docs/AI_AUDIT_LOG.md` cho phiên làm việc hiện tại.
- **Phần đã sử dụng**: Toàn bộ quy trình gộp nhánh, dọn dẹp Git, và nội dung báo cáo kiểm toán.
- **Phần đã chỉnh sửa**: Không có.
- **Minh chứng**:
  - Trạng thái Git gọn gàng chỉ còn nhánh `main` và `develop` đồng bộ với commit `8a82790`.
  - File tài liệu kiểm toán [PROJECT_AUDIT.md](file:///c:/Users/anhqu/source/repos/prn232_se18d06_group-01/docs/PROJECT_AUDIT.md).
- **File liên quan**:
  - `docs/PROJECT_AUDIT.md`
  - `docs/CHANGELOG.md`
  - `docs/AI_AUDIT_LOG.md`
