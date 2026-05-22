# 💬 Prompts — Tổng hợp Prompt đã sử dụng với AI

> File này lưu lại các prompt quan trọng đã gửi cho AI trong quá trình phát triển dự án.
> Mục đích: minh bạch, tái sử dụng, và đánh giá chất lượng output từ AI.

---

## Hướng dẫn ghi prompt

```markdown
### Prompt #[Số thứ tự] — [Mô tả ngắn]

- **Ngày**: [YYYY-MM-DD]
- **Người dùng**: [Tên]
- **Công cụ**: [ChatGPT / Copilot / Gemini / Claude]
- **Mục đích**: [Tại sao dùng prompt này]
- **Prompt**:
  > [Nội dung prompt gốc]
- **Đánh giá kết quả**: [Tốt / Cần chỉnh sửa / Không phù hợp]
- **Ghi chú**: [Bổ sung nếu có]
```

---

## Danh sách Prompts

### Prompt #1 — Đánh giá tài liệu SRS

- **Ngày**: 2026-05-20
- **Người dùng**: Nguyễn Hồ Anh Quân
- **Công cụ**: Gemini (Antigravity Agent)
- **Mục đích**: Đánh giá tài liệu đặc tả hệ thống trước khi bắt đầu code
- **Prompt**:
  > [Nội dung SRS]
  > Đánh giá dự án này đã oke để bắt đầu làm chưa
- **Đánh giá kết quả**: Tốt — AI chỉ ra được các thiếu sót trong models hiện tại so với SRS, đề xuất 5 quyết định thiết kế hợp lý
- **Ghi chú**: AI phát hiện đúng các vấn đề: properties thiếu `public`, thiếu audit fields, Question design chưa rõ ràng

---

### Prompt #2 — Lên Implementation Plan

- **Ngày**: 2026-05-20
- **Người dùng**: Nguyễn Hồ Anh Quân
- **Công cụ**: Gemini (Antigravity Agent)
- **Mục đích**: Tạo kế hoạch triển khai chi tiết trước khi code
- **Prompt**:
  > okay giờ xuất lại 1 file kế hoạch chuẩn trước , chưa code vội
- **Đánh giá kết quả**: Tốt — Plan chi tiết 6 phase, có DB schema, API endpoints, NuGet packages, verification plan
- **Ghi chú**: Plan được dùng làm baseline cho toàn bộ quá trình phát triển

---

### Prompt #3 — Implement Phase 1 & 2

- **Ngày**: 2026-05-20
- **Người dùng**: Nguyễn Hồ Anh Quân
- **Công cụ**: Gemini (Antigravity Agent)
- **Mục đích**: Generate code cho Foundation + Auth + Core APIs
- **Prompt**:
  > tiếp tục phase 2 đi
- **Đánh giá kết quả**: Tốt — Build thành công 0 errors, tất cả API endpoints hoạt động qua curl test
- **Ghi chú**: AI tự tạo seed data Minna no Nihongo Bài 1-2 với từ vựng, ngữ pháp, câu hỏi trắc nghiệm thực tế

---

### Prompt #4 — Fix .NET Runtime Issue & Complete Phase 3

- **Ngày**: 2026-05-22
- **Người dùng**: Nguyễn Hồ Anh Quân
- **Công cụ**: Gemini (Antigravity Agent)
- **Mục đích**: Giải quyết lỗi khởi chạy ứng dụng do thiếu môi trường .NET 8 runtime và hoàn thành các thành phần còn thiếu của Phase 3.
- **Prompt**:
  > /Users/nguyenhoanhquan/RiderProjects/JLearn/JLearn/bin/Debug/net8.0/JLearn
  > You must install or update .NET to run this application.
  > ... (Error detail)
- **Đánh giá kết quả**: Xuất sắc — AI đề xuất và áp dụng giải pháp RollForward Major trong file csproj giúp chạy mượt mà trên .NET 10 mà không cần sửa đổi target framework hay bắt người dùng cài đặt thêm môi trường. Tự động hoàn thành các việc còn thiếu gồm: đăng ký DI, chạy Migration tạo database columns, tạo TrackingController.
- **Ghi chú**: Tiết kiệm thời gian cài đặt môi trường đáng kể, giúp dự án tiếp tục phát triển trơn tru.
