# 📋 Báo Cáo Kiểm Toán Dự Án (Project Audit Report) — JLearn

> **Tài liệu kiểm toán mã nguồn và cấu trúc hệ thống JLearn**  
> *Dự án phục vụ môn học PRN232 — FPT University*  
> *Ngày thực hiện: 15/06/2026*

---

## 1. Tổng quan Dự án (Project Overview)

**JLearn** là nền tảng học tiếng Nhật trực tuyến, tập trung vào tối ưu hóa ghi nhớ từ vựng thông qua phương pháp **Lặp lại ngắt quãng (Spaced Repetition)** với thuật toán **SM-2**.

### ⚠️ Sự thay đổi kiến trúc quan trọng (Architectural Pivot)
Qua phân tích lịch sử commit và mã nguồn hiện tại (nhánh `main` / `develop` sau khi đồng bộ với nhánh `spaced-repetition`), dự án đã có một bước chuyển dịch lớn về mặt tính năng:
* **Mô hình cũ (Phase 1-3)**: Quản lý học tập theo lộ trình cố định (Course -> Lesson -> Vocabulary / Grammar) và làm bài trắc nghiệm (Quiz).
* **Mô hình mới (Hiện tại)**: Loại bỏ hoàn toàn lộ trình cố định và hệ thống trắc nghiệm mặc định. Thay thế bằng **Custom Decks (Bộ thẻ tự chọn)** và **Custom Cards (Thẻ từ vựng tự tạo)** do người dùng tự quản lý, đi kèm với tính năng **AI Import (Nhập từ vựng tự động từ JSON)** và thuật toán **Spaced Repetition (SM-2)** áp dụng trực tiếp lên các thẻ tự chọn này.

---

## 2. Kiểm toán cấu trúc mã nguồn (Codebase Audit)

### 🖥️ Backend (.NET 8 Web API)
Mã nguồn backend nằm trong thư mục `JLearn/` và được triển khai theo kiến trúc **Layered (N-Tier) kết hợp Repository Pattern & Unit of Work**.

* **Cấu trúc thư mục**:
  * `Controllers/`: Chỉ giữ lại 2 controller hoạt động là `AuthController` (xác thực) và `CustomDecksController` (quản lý bộ thẻ, thẻ từ vựng, import và chấm điểm ôn tập).
  * `Models/`: Rút gọn tối đa, chỉ còn các thực thể hoạt động:
    * `User.cs` & `UserRole.cs`: Quản lý tài khoản và quyền.
    * `CustomDeck.cs`: Đại diện cho bộ thẻ học của người dùng.
    * `CustomCard.cs`: Đại diện cho thẻ từ vựng (chứa từ, nghĩa và các trường dữ liệu thuật toán SM-2).
    * `Base/BaseEntity.cs`: Lớp cơ sở tự động quản lý thời gian khởi tạo (`CreatedAt`, `UpdatedAt`) và trạng thái xóa mềm (`IsDeleted`).
  * `Data/`:
    * `AppDbContext.cs`: Cấu hình EF Core, thiết lập Fluent API, quan hệ 1-N giữa User -> Decks -> Cards, và tích hợp **Global Query Filter** để tự động loại bỏ các thực thể đã bị xóa mềm (`IsDeleted == false`).
    * `DbSeeder.cs`: Tự động khởi tạo dữ liệu mẫu cho tài khoản Admin (`admin@jlearn.com` / `Admin@123` và `admin@test.com` / `123`).
  * `Services/`:
    * `AuthService.cs`: Đăng ký, đăng nhập, cấp JWT Access Token và Refresh Token.
    * `CustomDeckService.cs`: Chứa toàn bộ nghiệp vụ CRUD Bộ thẻ/Thẻ học, cơ chế nhập dữ liệu JSON (`ImportCardsAsync`) và triển khai logic thuật toán **SM-2** (`ReviewCardAsync`).
  * `UnitOfWork/`: Đăng ký tập trung các Repository cho `User`, `CustomDeck`, và `CustomCard`.

* **Đánh giá mã nguồn Backend**:
  * **Ưu điểm**: Mã nguồn rất sạch sẽ, các file cũ của thực thể `Course`, `Lesson`, `Vocabulary`, `Grammar`, `Quiz` đã được dọn dẹp triệt để giúp giảm thiểu dung lượng và tránh xung đột trong lúc compile.
  * **RollForward Config**: File `JLearn.csproj` đã được cấu hình `<RollForward>Major</RollForward>` giúp dự án chạy mượt mà trên môi trường có SDK .NET mới hơn (ví dụ .NET 10) mà không bị crash do thiếu SDK .NET 8.

---

### 🎨 Frontend (React + TypeScript)
Mã nguồn frontend nằm trong thư mục `jlearn-frontend/` được khởi tạo bằng **Vite** và cấu hình **Tailwind CSS**.

* **Giao diện & Trải nghiệm người dùng (UX/UI)**:
  * Thiết kế theo phong cách hiện đại với hiệu ứng Glassmorphic, bo góc mềm mại, phân tách rõ ràng Sidebar điều hướng và khu vực nội dung.
  * Component **`Flashcard.tsx`** có hiệu ứng lật 3D đẹp mắt (CSS perspective & transform) khi nhấn ôn tập thẻ.
* **Luồng dữ liệu & Xác thực (Auth & API Integration)**:
  * **`AuthContext.tsx`**: Quản lý trạng thái đăng nhập toàn cục.
  * **`api.ts` (Axios Client)**: Tích hợp Axios Interceptor tự động đính kèm Token JWT vào header của mỗi request và tự động gọi endpoint Refresh Token khi nhận mã lỗi `401 Unauthorized` từ server mà không làm gián đoạn trải nghiệm người dùng.
* **Hệ thống Routing (`App.tsx`)**:
  * Các trang học tập: `/decks` (Danh sách bộ thẻ), `/decks/:id` (Chi tiết thẻ), `/decks/:id/preview` (Xem trước danh sách thẻ), `/decks/:id/review` (Ôn tập SRS).

---

## 3. Phân tích Thuật toán Spaced Repetition (SM-2)

Thuật toán SM-2 được triển khai tại phương thức `ReviewCardAsync` trong [CustomDeckService.cs](file:///c:/Users/anhqu/source/repos/prn232_se18d06_group-01/JLearn/Services/CustomDeckService.cs#L257-L314):

1. **Tiếp nhận phản hồi (User Rating - `rating`)**: Người dùng tự đánh giá mức độ nhớ từ 1 đến 5:
   * `1-2`: Không nhớ / nhớ mơ hồ (Cần ôn lại ngay).
   * `3-5`: Nhớ tốt đến rất tốt.
2. **Cập nhật Ease Factor (Hệ số dễ - `EaseFactor`)**:
   $$\text{EaseFactor}_{\text{new}} = \text{EaseFactor}_{\text{old}} + (0.1 - (5 - \text{rating}) \times (0.08 + (5 - \text{rating}) \times 0.02))$$
   *Giới hạn tối thiểu của EaseFactor là 1.3.*
3. **Tính toán số ngày hẹn gặp lại (`IntervalDays`)**:
   * Nếu trả lời sai (`rating < 3`): `Repetitions` reset về `0`, `IntervalDays = 1` (Ôn tập lại vào ngày mai).
   * Nếu trả lời đúng (`rating >= 3`):
     * Lần đúng đầu tiên (`Repetitions == 1`): `IntervalDays = 1` ngày.
     * Lần đúng thứ hai (`Repetitions == 2`): `IntervalDays = 6` ngày.
     * Từ lần đúng thứ ba trở đi: $\text{IntervalDays}_{\text{new}} = \text{IntervalDays}_{\text{old}} \times \text{EaseFactor}$.
4. **Hẹn ngày ôn tập tiếp theo (`NextReviewDate`)**:
   $$\text{NextReviewDate} = \text{DateTime.UtcNow} + \text{IntervalDays}$$

---

## 4. Các vấn đề tồn đọng & Đề xuất (Technical Debt & Recommendations)

Qua kiểm tra, hiện tại dự án đang có một số **nợ kỹ thuật (Technical Debt)** cần xử lý do quá trình thay đổi kiến trúc:

| Vấn đề phát hiện | Chi tiết ảnh hưởng | Hướng xử lý đề xuất | Mức độ |
| :--- | :--- | :--- | :--- |
| **Giao diện Admin cũ** | Các file `AdminCoursesPage.tsx` và `AdminLessonsPage.tsx` vẫn import vào `App.tsx` và gọi API cũ (đã bị xóa bỏ trên backend), truy cập sẽ bị crash hoặc báo lỗi 404. | Tiến hành xóa bỏ các trang Admin cũ này và gỡ các route tương ứng khỏi `App.tsx`. | **Cao** |
| **Giao diện Quiz cũ** | File `QuizPage.tsx` vẫn gọi API `/api/quizzes/...` vốn không còn tồn tại trên Backend. | Gỡ bỏ trang Quiz cũ này nếu dự án chuyển hẳn sang mô hình học từ vựng SRS. | **Trung bình** |
| **Mock data ở Admin Dashboard** | Trang `AdminDashboardPage.tsx` hiện hiển thị các số liệu tĩnh không kết nối API thực tế. | Cập nhật API thống kê số lượng User, Decks, Cards thực tế từ Backend để hiển thị. | **Thấp** |

---

## 5. Nhật ký Kiểm toán sử dụng AI (AI Audit Log Summary)

Dự án tuân thủ nghiêm ngặt quy định sử dụng AI của môn học, được ghi nhận qua các giai đoạn chính:

1. **Giai đoạn 1 (20-05-2026)**: Khởi tạo khung dự án .NET (Models, DbContext, generic Repositories, Unit of Work, Authentication và JWT).
2. **Giai đoạn 2 (22-05-2026)**: Sửa lỗi môi trường runtime (.NET SDK) và cài đặt endpoints Spaced Repetition cùng cấu trúc dữ liệu SM-2 trên DB.
3. **Giai đoạn 3 (22-05-2026)**: Thiết lập Frontend React + Tailwind CSS v4 và viết giao diện khung.
4. **Giai đoạn 4 (07-06-2026 đến 15-06-2026)**: Thực hiện thay đổi nghiệp vụ (Pivot) từ Course/Lesson sang Custom Decks, tích hợp AI JSON Import, hoàn thiện Flashcard 3D và thuật toán ôn tập SM-2 thực tế. Dọn dẹp mã nguồn backend thừa.
