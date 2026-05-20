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

- **Người thực hiện**: Nguyễn Hoàn Quân
- **Công cụ AI**: Gemini (Antigravity Agent)
- **Prompt**: Cung cấp tài liệu SRS chi tiết và yêu cầu đánh giá, lên kế hoạch, sau đó implement Phase 1 (Foundation) và Phase 2 (Auth + Core APIs)
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
