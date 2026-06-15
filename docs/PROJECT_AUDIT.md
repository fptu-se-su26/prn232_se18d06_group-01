# 📋 Báo Cáo Kiểm Toán Dự Án (Project Audit Report) — JLearn

> **Tài liệu kiểm toán mã nguồn và cấu trúc hệ thống JLearn**  
> *Dự án phục vụ môn học PRN232 — FPT University*  
> *Ngày thực hiện cập nhật: 15/06/2026*

---

## 1. Tổng quan Dự án (Project Overview)

**JLearn** là nền tảng học tiếng Nhật trực tuyến, cho phép người dùng tự tạo các bộ thẻ học và thẻ từ vựng để ôn tập linh hoạt.

### 🔄 Thay đổi lớn: Loại bỏ hoàn toàn thuật toán SM-2 (SRS)
Để đơn giản hóa nghiệp vụ học tập, tối ưu hóa trải nghiệm người dùng và giảm bớt sự phức tạp không cần thiết, dự án đã thực hiện một đợt tái cấu trúc lớn:
* **Trước đây**: Sử dụng thuật toán Lặp lại ngắt quãng (Spaced Repetition - SM-2) với cơ chế hẹn lịch ôn tập dựa trên Ease Factor và số lần lặp lại (rating 1-5).
* **Hiện tại**: **Loại bỏ hoàn toàn thuật toán SM-2 và cơ chế hẹn giờ ôn tập**. Thay thế bằng **Chế độ Học tự do (Free Study Mode)** trực quan: người dùng tự do lật thẻ, học bất kỳ lúc nào họ muốn và điều khiển qua phím tắt.

---

## 2. Kiểm toán cấu trúc mã nguồn hiện tại (Codebase Audit)

### 🖥️ Backend (.NET 8 Web API)
Mã nguồn backend nằm trong thư mục `JLearn/` và chạy ổn định trên .NET 8/10 SDK.

* **Các thực thể (Models)**:
  * `User.cs` & `UserRole.cs`: Quản lý người dùng và vai trò.
  * `CustomDeck.cs`: Bộ thẻ học. Bổ sung trường `IsPublic` (boolean) để thiết lập chế độ công khai/riêng tư.
  * `CustomCard.cs`: Thẻ từ vựng nằm trong bộ thẻ. **Đã xóa bỏ hoàn toàn** các cột thuật toán cũ: `Level`, `NextReviewDate`, `EaseFactor`, `Repetitions`, `IntervalDays`.
* **Database & Migration**:
  * Đã áp dụng migration **`RemoveSrsFields`** để dọn sạch các cột dữ liệu liên quan đến SM-2 trong cơ sở dữ liệu SQL Server.
  * Giữ nguyên cơ chế xóa mềm (`IsDeleted`) thông qua Global Query Filter trong `AppDbContext.cs`.
* **Dịch vụ & API Controller (`CustomDecksController.cs` & `CustomDeckService.cs`)**:
  * Đã xóa bỏ các API endpoints cũ: `/api/custom-decks/{id}/reviews` (hẹn lịch ôn) và `/api/custom-decks/{id}/review` (gửi đánh giá).
  * **Tính năng Public & Clone**: Thêm API `GET /api/custom-decks/public` để lấy danh sách bộ thẻ công khai và `POST /api/custom-decks/{id}/clone` giúp người dùng copy bộ thẻ công khai của người khác thành bộ thẻ cá nhân của mình.
  * **CSV Import**: Nâng cấp phương thức `ImportCardsAsync` để tự động phân tích (parse) chuỗi định dạng CSV tiêu chuẩn (hỗ trợ dấu phẩy và nháy kép `"word","meaning"`), giúp người dùng import từ vựng hàng loạt dễ dàng từ file Excel/CSV.

---

### 🎨 Frontend (React + TypeScript)
Mã nguồn frontend đã được dọn dẹp triệt để các file và route dư thừa, chỉ giữ lại giao diện gọn nhẹ và hiện đại.

* **Hệ thống các Trang (Pages)**:
  * `Login.tsx`: Đăng nhập hệ thống.
  * `Dashboard.tsx`: Dashboard tổng quan thông tin người dùng.
  * `CustomDecksPage.tsx`: Quản lý các bộ thẻ cá nhân của người dùng và duyệt danh sách bộ thẻ công khai chia sẻ bởi người khác.
  * `DeckDetailPage.tsx`: 
    * Xem danh sách từ vựng chi tiết.
    * CRUD thẻ từ trực tiếp trên giao diện (hỗ trợ chỉnh sửa nhanh inline).
    * Công cụ Import hàng loạt từ CSV.
    * Tùy chỉnh trạng thái Công khai/Riêng tư của bộ thẻ.
  * `CustomPreviewDeckPage.tsx` (Chế độ Học tự do):
    * Giao diện thẻ lật 3D đẹp mắt kết nối dữ liệu thực tế.
    * Hỗ trợ bộ phím tắt thân thiện với người dùng: Phím `Space` để lật thẻ, `←/A` quay lại thẻ trước, `→/D` đi tới thẻ tiếp theo.
* **Xác thực & Gọi API**:
  * Sử dụng Axios client tích hợp tự động xử lý token JWT và cơ chế Refresh Token khi hết hạn (`401 Unauthorized`).

---

## 3. Đánh giá Ưu điểm & Nợ kỹ thuật (Highlights & Technical Debt)

### ✅ Điểm sáng (Highlights)
* **Trải nghiệm học tập mượt mà**: Việc loại bỏ SM-2 giúp giao diện ôn tập không còn phức tạp với các nút đánh giá 1-5, người dùng chỉ cần tập trung lật thẻ và học tự do.
* **Tính năng Chia sẻ cộng đồng**: Cơ chế Public/Clone Decks giúp tăng tính tương tác giữa các tài khoản, người học có thể chia sẻ bộ từ vựng cho nhau.
* **Dọn dẹp code tối đa**: Đã xóa bỏ hoàn toàn tất cả các file thừa từ giai đoạn trước (như QuizPage, các trang quản trị cũ Courses/Lessons của Admin), giúp dự án không còn code "rác" (dead code).

### 🛠️ Định hướng phát triển tiếp theo (Next Steps)
1. **Cập nhật Seed Data**: Bổ sung thêm nhiều bộ thẻ từ vựng tiếng Nhật mẫu (như từ vựng N5, N4, Minna no Nihongo) ở trạng thái Public để người dùng mới đăng nhập có thể Clone và học ngay lập tức.
2. **Xuất file Excel/CSV**: Bổ sung tính năng Export bộ thẻ hiện tại ra file CSV để người dùng có thể lưu trữ ngoại tuyến (offline).
3. **Thống kê Tiến độ**: Bổ sung tính năng đánh dấu thẻ "Đã thuộc" (nhẹ nhàng, không dùng thuật toán hẹn lịch) để hiển thị thanh phần trăm tiến trình hoàn thành ngay trong trang chi tiết bộ thẻ.
