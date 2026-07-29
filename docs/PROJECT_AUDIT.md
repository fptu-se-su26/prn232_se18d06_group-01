# 📋 Báo Cáo Kiểm Toán & Kỹ Thuật Dự Án (Project Audit Report) — JLearn

> **Tài liệu kiểm toán mã nguồn, kiến trúc và danh mục tính năng của hệ thống JLearn**  
> *Dự án phục vụ môn học PRN232 — FPT University*  
> *Lần cập nhật cuối: 20/07/2026*

---

## 1. Tổng quan Dự án (Project Overview)

**JLearn** là nền tảng Web học tiếng Nhật trực tuyến hỗ trợ cá nhân hóa việc học từ vựng thông qua cơ chế tự tạo bộ thẻ, lật thẻ 3D trực quan, kiểm tra trắc nghiệm tương tác và chia sẻ bộ thẻ trong cộng đồng.

### 🔄 Các đợt cải tiến & nâng cấp quan trọng:
1. **Loại bỏ hoàn toàn thuật toán SM-2 (SRS):** Loại bỏ lịch hẹn ôn tập cứng nhắc và các nút đánh giá cấp độ 1-5. Thay bằng 2 chế độ học năng động:
   - **Học Tự Do (Free Study Mode):** Lật thẻ 3D với phím tắt điều hướng nhanh (`Space`, `←/A`, `→/D`).
   - **Trắc Nghiệm (Quiz Mode):** Bài kiểm tra 4 lựa chọn tự động sinh ngẫu nhiên từ bộ thẻ với 3 chế độ (Nhật-Việt, Việt-Nhật, Trộn).
2. **Hệ thống Cộng đồng & Nhân bản (Public & Clone Decks):** Người học có thể công khai bộ thẻ của mình hoặc sao chép bộ thẻ công khai của thành viên khác về thư viện cá nhân với 1-click.
3. **Chỉnh sửa trực tiếp (Inline Editing) & Bulk CSV Import:** Cho phép sửa trực tiếp từ vựng trên bảng danh sách và import hàng loạt bằng văn bản CSV (hỗ trợ ngoặc kép).
4. **Hệ thống Theme Sáng/Tối chủ động (Dark Mode):** Sử dụng `@custom-variant dark` của Tailwind v4 cùng công tắc chuyển đổi trên Sidebar lưu trạng thái vào `localStorage`.
5. **Docker Compose Orchestration:** Đóng gói hoàn chỉnh SQL Server 2022, Backend ASP.NET Core Web API 8.0 và Frontend Nginx React App.

---

## 2. Kiểm toán Kiến trúc & Mã Nguồn (Codebase Audit)

### 🖥️ Backend (.NET 8 Web API)
Mã nguồn Backend nằm trong thư mục `JLearn/` tuân thủ kiến trúc phân lớp (N-Tier) kết hợp **Repository Pattern & Unit of Work**:

* **Models Layer (`JLearn/Models/`)**:
  * `User.cs`: Quản lý người dùng, mật khẩu hash, role và token refresh.
  * `CustomDeck.cs`: Bộ thẻ từ vựng với thuộc tính `IsPublic` (Boolean) để thiết lập chia sẻ cộng đồng.
  * `CustomCard.cs`: Thẻ từ vựng chứa `Word` (Kanji/Từ vựng) và `Meaning` (Nghĩa tiếng Việt). Đã dọn sạch 5 cột SRS thừa (`Level`, `NextReviewDate`, `EaseFactor`, `Repetitions`, `IntervalDays`).
* **Database & Migration (`JLearn/Data/` & `JLearn/Migrations/`)**:
  * Đã áp dụng migration tinh gọn `InitialCreate`.
  * Đã cài đặt Global Query Filter trong `AppDbContext.cs` để tự động loại bỏ các bản ghi đã xóa mềm (`IsDeleted = true`).
  * `DbSeeder.cs`: Tự động nạp tài khoản dùng thử (`admin@test.com` / `123`) và các bộ thẻ tiếng Nhật mẫu (N5, N4) ở chế độ Public.
* **Services Layer (`JLearn/Services/`)**:
  * `AuthService.cs`: Xử lý đăng ký, đăng nhập JWT, làm mới token.
  * `CustomDeckService.cs`: Logic CRUD bộ thẻ cá nhân, lấy danh sách bộ thẻ công khai, nhân bản bộ thẻ (`CloneDeckAsync`), và thuật toán bóc tách chuỗi CSV nâng cao (`ImportCardsAsync`) hỗ trợ ngoặc kép bao quanh dấu phẩy.
* **Controllers Layer (`JLearn/Controllers/`)**:
  * `AuthController.cs`: Endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`.
  * `CustomDecksController.cs`: Endpoints CRUD bộ thẻ, quản lý thẻ từ vựng, import CSV, public decks và clone deck.

---

### 🎨 Frontend (React 18 + TypeScript + Tailwind CSS v4)
Mã nguồn Frontend nằm trong thư mục `jlearn-frontend/` được dọn dẹp sạch sẽ code rác, cấu hình TypeScript chặt chẽ:

* **Hệ thống Trang (Pages)**:
  * `Login.tsx`: Trang đăng nhập giao diện Indigo mượt mà, hỗ trợ Dark Mode.
  * `Dashboard.tsx`: Hiển thị số liệu thống kê cá nhân và danh sách bộ thẻ cộng đồng cho phép Clone ngay lập tức.
  * `CustomDecksPage.tsx`: Quản lý bộ thẻ cá nhân và chuyển tab duyệt bộ thẻ cộng đồng.
  * `DeckDetailPage.tsx`: 
    * Xem danh sách từ vựng dạng bảng.
    * Sửa từ vựng trực tiếp (Inline Editing) với nút **Save** linh động.
    * Import từ vựng hàng loạt qua CSV Modal.
    * Nút điều hướng nhanh đến **"Học tự do"** và **"Kiểm tra (Quiz)"**.
  * `CustomPreviewDeckPage.tsx`: Chế độ học Flashcard 3D với bộ phím tắt `Space`, `←/A`, `→/D`.
  * `DeckQuizPage.tsx`: Trang thi trắc nghiệm tương tác với 3 chế độ (Nhật-Việt, Việt-Nhật, Trộn), phản hồi đúng/sai tức thì và tóm tắt kết quả bài làm.
* **Layout & Theme Switcher**:
  * `MainLayout.tsx`: Thanh điều hướng Sidebar đáp ứng (Responsive), tự động highlight trang active và tích hợp công tắc đổi theme Mặt trời/Mặt trăng.
  * `index.css` & `App.tsx`: Khởi tạo và đồng bộ class `.dark` trên toàn bộ ứng dụng.

---

## 3. Danh Mục RESTful API Specification

| Endpoint | Method | Auth | Mô tả |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Đăng ký tài khoản người dùng |
| `/api/auth/login` | `POST` | Public | Đăng nhập nhận JWT Token |
| `/api/auth/refresh-token` | `POST` | Public | Cấp lại Access Token mới |
| `/api/custom-decks` | `GET` | Bearer | Lấy bộ thẻ cá nhân |
| `/api/custom-decks/public` | `GET` | Bearer | Lấy bộ thẻ cộng đồng công khai |
| `/api/custom-decks/{id}` | `GET` | Bearer | Chi tiết 1 bộ thẻ |
| `/api/custom-decks` | `POST` | Bearer | Tạo bộ thẻ mới |
| `/api/custom-decks/{id}` | `PUT` | Bearer | Sửa thông tin bộ thẻ |
| `/api/custom-decks/{id}` | `DELETE` | Bearer | Xóa mềm bộ thẻ |
| `/api/custom-decks/{id}/clone` | `POST` | Bearer | Nhân bản bộ thẻ công khai |
| `/api/custom-decks/{id}/cards` | `GET` | Bearer | Lấy danh sách thẻ từ vựng |
| `/api/custom-decks/{id}/cards` | `POST` | Bearer | Thêm 1 thẻ thủ công |
| `/api/custom-decks/{id}/cards/{cardId}` | `PUT` | Bearer | Sửa trực tiếp từ vựng/nghĩa |
| `/api/custom-decks/{id}/cards/{cardId}` | `DELETE` | Bearer | Xóa 1 thẻ từ vựng |
| `/api/custom-decks/{id}/import` | `POST` | Bearer | Import hàng loạt từ CSV |

---

## 4. Hướng Dẫn Vận Hành Môi Trường (Deployment Guide)

### Triển khai bằng Docker Compose:
```bash
docker-compose up -d --build
```
- **Frontend App**: [http://localhost](http://localhost)
- **Backend Swagger UI**: [http://localhost:5225/swagger](http://localhost:5225/swagger)
- **Database**: `localhost:1433` (SQL Server 2022)

---

## 5. Đánh Giá Ưu Điểm & Kết Luận

1. **Trải nghiệm Học tập Toàn diện**: Kết hợp linh hoạt giữa việc học lật thẻ tự do và trắc nghiệm chọn đáp án, giúp người học ghi nhớ từ vựng nhanh chóng.
2. **Tính Năng Chia Sẻ Cao**: Cơ chế Public/Clone giúp xây dựng kho bộ thẻ phong phú từ sự đóng góp của cộng đồng.
3. **Mã Nguồn Sạch Sẽ & Chuẩn Hóa**: Loại bỏ hoàn toàn dead code, áp dụng đầy đủ các Best Practices (JWT Refresh, Repository Pattern, Selector Dark Mode, Docker Compose).
