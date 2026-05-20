# 🪞 Reflection — Phản ánh & Đánh giá Sử dụng AI

> File này ghi lại những phản ánh, đánh giá về quá trình sử dụng AI trong dự án.
> Mỗi thành viên nên ghi lại: AI đã giúp gì, hạn chế gặp phải, bài học rút ra.

---

## Hướng dẫn viết Reflection

```markdown
### [Tên thành viên] — [Ngày hoặc Phase]

**AI đã giúp được gì?**
- [Liệt kê các phần AI hỗ trợ hiệu quả]

**Hạn chế / Vấn đề gặp phải?**
- [Các phần AI output không chính xác hoặc cần chỉnh sửa]

**Phần nào tự làm (không dùng AI)?**
- [Liệt kê các phần tự viết]

**Bài học rút ra?**
- [Kinh nghiệm khi làm việc với AI]
```

---

## Reflection Entries

### Nguyễn Hoàn Quân — Phase 1 & 2 (2026-05-20)

**AI đã giúp được gì?**
- Đánh giá tài liệu SRS, phát hiện thiếu sót trong models ban đầu
- Đề xuất quyết định thiết kế (inline OptionA-D, Global Query Filter, In-Memory Cache)
- Generate toàn bộ boilerplate code: Models, DbContext, Repository, UoW, DTOs
- Tạo JWT Authentication flow hoàn chỉnh
- Tạo seed data tiếng Nhật thực tế (Minna no Nihongo)
- Setup Docker SQL Server, EF Core Migration

**Hạn chế / Vấn đề gặp phải?**
- *(Ghi lại nếu có vấn đề cần fix thủ công)*

**Phần nào tự làm (không dùng AI)?**
- Viết tài liệu SRS ban đầu
- Quyết định tech stack và kiến trúc tổng thể
- Review và approve các quyết định thiết kế AI đề xuất

**Bài học rút ra?**
- Cung cấp SRS càng chi tiết → AI output càng chính xác
- Nên review từng quyết định thiết kế thay vì chấp nhận tất cả
- AI rất tốt cho boilerplate nhưng business logic cần kiểm tra kỹ
