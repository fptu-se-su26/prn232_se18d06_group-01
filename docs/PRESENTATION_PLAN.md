# 🎓 Kịch Bản & Kế Hoạch Thuyết Trình Dự Án JLearn
**Nền tảng Học từ vựng & Kiểm tra Tiếng Nhật Trực tuyến**

---

## 📌 Tổng Quan Chương Trình Thuyết Trình
- **Thời lượng dự kiến**: 15 - 20 phút (thuyết trình 10-12 phút + Demo 5 phút + Q&A).
- **Mục tiêu**: Làm nổi bật tính thực tiễn của sản phẩm, kiến trúc phần mềm chuẩn mực (N-Tier, Repository & Unit of Work, Docker), và các tính năng đột phá của dự án JLearn.

---

## 📑 Cấu Trúc Các Slide & Lời Nói (Presentation Script)

### 🔹 Slide 1: Mở Đầu & Giới Thiệu Dự Án
- **Tiêu đề**: JLearn – Smart Japanese Vocabulary & Quiz Platform
- **Nội dung Slide**:
  - Tên dự án: **JLearn**
  - Thành viên thực hiện: Group 01 (PRN232)
  - Công nghệ cốt lõi: ASP.NET Core 8 Web API + React TypeScript + Docker Compose
- **Kịch bản nói (Script)**:
  > *"Kính chào thầy cô và các bạn. Nhóm 01 xin phép được trình bày dự án **JLearn** – Nền tảng học từ vựng và trắc nghiệm tiếng Nhật trực tuyến. Dự án được xây dựng nhằm giải quyết bài toán ghi nhớ từ vựng tiếng Nhật hiệu quả, cá nhân hóa trải nghiệm học tập và tạo môi trường chia sẻ kiến thức trong cộng đồng người học."*

---

### 🔹 Slide 2: Đặt Vấn Đề & Giải Pháp (Problem & Solution)
- **Nội dung Slide**:
  - ❌ **Thách thức khi học tiếng Nhật**:
    - Số lượng từ vựng và Kanji lớn, khó nhớ nếu chỉ đọc sách truyền thống.
    - Thiếu công cụ tự tạo thẻ học phù hợp với giáo trình cá nhân.
    - Thiếu theo dõi tiến độ và đánh giá kết quả trắc nghiệm tức thì.
  - ✅ **Giải pháp JLearn mang lại**:
    - **Flashcard tương tác**: Lật thẻ trực quan, ghi nhớ phản xạ 2 chiều Nhật - Việt.
    - **Tùy biến bộ thẻ**: Cho phép tạo, chỉnh sửa, nhập hàng loạt (Bulk Import) từ vựng từ file văn bản.
    - **Quiz Mode đa dạng**: Kiểm tra trắc nghiệm theo chiều Nhật $\rightarrow$ Việt, Việt $\rightarrow$ Nhật hoặc Trộn ngẫu nhiên.
    - **Cộng đồng mở (Explore)**: Cho phép sao chép (Clone) bộ thẻ của người khác chỉ với 1-click.
- **Kịch bản nói (Script)**:
  > *"Việc học tiếng Nhật đòi hỏi lặp lại từ vựng thường xuyên. Các ứng dụng có sẵn thường gò bó trong bộ từ vựng cố định. JLearn ra đời như một giải pháp linh hoạt: vừa cho phép người dùng tự tạo học phần riêng, vừa hỗ trợ làm bài trắc nghiệm tính điểm tự động, vừa kết nối cộng đồng để chia sẻ tri thức."*

---

### 3. Kiến Trúc Hệ Thống (System Architecture)
- **Nội dung Slide**:
  - **Mô hình kiến trúc N-Tier (Layered Architecture)**:
    - **Presentation Layer**: React 18 + TypeScript + Tailwind CSS (Đóng gói Nginx)
    - **API Layer**: ASP.NET Core 8 Web API (RESTful Endpoints)
    - **Business Logic Layer**: Services & Interfaces (`CustomDeckService`, `AdminService`, `AuthService`)
    - **Data Access Layer**: Generic Repository Pattern + Unit of Work (`AppDbContext`, SQL Server)
  - **Docker Containerization**:
    - 3 Containers độc lập: `jlearn-frontend`, `jlearn-backend`, `jlearn-db` (MS SQL Server 2022).
- **Kịch bản nói (Script)**:
  > *"Về mặt kĩ thuật, JLearn được thiết kế theo kiến trúc N-Tier phân tầng rõ ràng. Hệ thống áp dụng thiết kế Repository Pattern kết hợp Unit of Work để đảm bảo tính toàn vẹn dữ liệu (Atomic Transactions). Tất cả các dịch vụ đều được đóng gói bằng Docker Compose, giúp việc triển khai (deploy) diễn ra nhất quán và nhanh chóng chỉ với một dòng lệnh."*

---

### 🔹 Slide 4: Tính Năng Dành Cho Học Viên (Learner Features)
- **Nội dung Slide**:
  - 🔑 **Authentication & Security**: Đăng ký, Đăng nhập JWT + Refresh Token (Duy trì phiên F5 không văng), Phân quyền Role-based.
  - 📚 **Quản lý Thẻ cá nhân**: Tạo bộ thẻ, thêm/sửa/xóa thẻ, Import từ vựng hàng loạt từ văn bản.
  - 🎴 **Chế độ Lật Thẻ (Preview Mode)**: Lật thẻ xem mặt chữ Kanji/Hiragana & Ý nghĩa.
  - 📝 **Chế độ Kiểm tra Trắc nghiệm (Quiz Mode)**:
    - Tùy chọn số lượng câu hỏi và chế độ kiểm tra (Nhật-Việt, Việt-Nhật, Trộn).
    - Tính điểm %, hiển thị kết quả và tự động lưu lịch sử điểm làm bài (`QuizResult`).
  - 🧭 **Khám phá & Clone Bộ thẻ**: Duyệt danh sách bộ thẻ công khai của cộng đồng, sao chép toàn bộ nội dung về kho cá nhân.
- **Kịch bản nói (Script)**:
  > *"Đối với người học, JLearn cung cấp đầy đủ vòng đời học tập: từ tạo bộ từ vựng, ôn tập lật thẻ, kiểm tra trắc nghiệm tính điểm cho đến xem lại lịch sử làm bài. Đặc biệt, tính năng Khám phá cho phép người dùng clone các bộ thẻ N5, N4 hay giao tiếp của thành viên khác chỉ trong 1 giây."*

---

### 🔹 Slide 5: Tính Năng Quản Trị Hệ Thống (Admin Panel)
- **Nội dung Slide**:
  - 📊 **Thống kê Tổng quan (Dashboard Stats)**: Tổng số người dùng, tổng số bộ thẻ, tổng số bài trắc nghiệm đã làm, số lượng user mới.
  - 👥 **Quản lý Người dùng**: Xem danh sách, tìm kiếm, Thay đổi quyền (Learner $\leftrightarrow$ Admin), Khóa / Mở khóa tài khoản (`IsLocked`), Xóa mềm user.
  - 🗂️ **Quản lý Bộ thẻ Toàn hệ thống**: Duyệt toàn bộ các bộ thẻ trên hệ thống, xóa bỏ các bộ thẻ vi phạm nội dung.
- **Kịch bản nói (Script)**:
  > *"Hệ thống dành riêng một trang Admin Dashboard cho quản trị viên với cơ chế bảo vệ JWT `[Authorize(Roles = "Admin")]`. Quản trị viên có thể theo dõi sức khỏe hệ thống qua các chỉ số thống kê, quản lý phân quyền và khóa các tài khoản vi phạm một cách tức thì."*

---

### 🔹 Slide 6: Các Điểm Sáng Kỹ Thuật (Technical Highlights)
- **Nội dung Slide**:
  - 🛡️ **BaseEntity & Soft Delete**: Xóa mềm dữ liệu thông qua trường `IsDeleted` và Global Query Filter của EF Core.
  - ⚡ **Auto Refresh Token & Sync Auth State**: Trải nghiệm mượt mà, đọc auth state đồng bộ tránh F5 bị đẩy về login.
  - 🎨 **Modern UX/UX & Dark Mode**: Hỗ trợ chuyển đổi chế độ Sáng/Tối (Light/Dark Mode) với Tailwind CSS chuẩn hóa.
  - 📄 **API Dashboard Comment Block**: Mỗi Controller đều có bảng tổng hợp API ngay đầu file code giúp tra cứu nhanh chóng.
- **Kịch bản nói (Script)**:
  > *"Một số điểm nổi bật về mặt lập trình của dự án bao gồm: Tính năng Xóa mềm (Soft Delete) giúp bảo toàn dữ liệu lịch sử; Cơ chế Refresh Token tự động giúp trải nghiệm người dùng không bị ngắt quãng; và Giao diện hiện đại hỗ trợ Dark Mode chuẩn hóa."*

---

## 🎬 Kịch Bản Demo Trực Tiếp (Live Demo Flow - 5 phút)

1. **Đăng ký & Đăng nhập**:
   - Mở trình duyệt tại `http://localhost`.
   - Thực hiện **Đăng ký** tài khoản mới hoặc đăng nhập tài khoản Learner.
   - Thử nghiệm nhấn **F5** để chứng minh trạng thái đăng nhập được giữ nguyên.
2. **Tạo Bộ Thẻ & Bulk Import**:
   - Vào mục **Thẻ cá nhân** $\rightarrow$ Tạo bộ thẻ mới *"Từ vựng N5 Lớp Học"*.
   - Dùng tính năng **Import từ vựng** dán danh sách từ dạng `Word - Meaning` để tạo nhanh 5-10 thẻ.
3. **Trắc Nghiệm & Xem Lịch Sử Điểm**:
   - Bấm vào nút **Trắc nghiệm** $\rightarrow$ Chọn chế độ *"Trộn"* $\rightarrow$ Làm bài kiểm tra.
   - Hoàn thành bài trắc nghiệm $\rightarrow$ Xem bảng kết quả % $\rightarrow$ Xem lại **Lịch sử làm bài** được cập nhật tự động.
4. **Khám Phá & Clone Deck**:
   - Chuyển sang mục **🧭 Khám phá** trên Sidebar.
   - Tìm kiếm bộ thẻ công khai $\rightarrow$ Bấm **Sao chép** $\rightarrow$ Kiểm tra bộ thẻ đã xuất hiện trong thư viện cá nhân.
5. **Chức năng Admin**:
   - Đăng xuất $\rightarrow$ Đăng nhập tài khoản Admin (`admin@jlearn.com` / `Admin@123`).
   - Truy cập **Admin Dashboard** (`/admin`) $\rightarrow$ Cho xem biểu đồ thống kê, quản lý người dùng, khóa/mở khóa tài khoản.

---

## ❓ Các Câu Hỏi Thường Gặp & Câu Trả Lời (Q&A Preparation)

### ❓ Q1: Tại sao hệ thống lại dùng cả `AccessToken` và `RefreshToken`?
> **Trả lời**: AccessToken có thời gian sống ngắn (ví dụ: 15-30 phút) để đảm bảo bảo mật nếu bị lộ. RefreshToken có thời gian sống dài hơn (7 ngày) được lưu an toàn ở DB. Khi AccessToken hết hạn, Frontend dùng RefreshToken để xin cấp AccessToken mới mà người dùng không phải nhập lại mật khẩu.

### ❓ Q2: Xóa mềm (Soft Delete) trong dự án được triển khai như thế nào?
> **Trả lời**: Tất cả Entity đều kế thừa từ `BaseEntity` có trường `IsDeleted`. Khi thực hiện thao tác xóa, thay vì dùng `Remove()`, hệ thống cập nhật `IsDeleted = true`. Đồng thời, trong `AppDbContext` có cấu hình Global Query Filter `HasQueryFilter(e => !e.IsDeleted)` để mọi câu lệnh SELECT tự động bỏ qua các bản ghi đã xóa.

### ❓ Q3: Làm thế nào để đảm bảo tính an toàn dữ liệu khi một bài trắc nghiệm hoàn thành?
> **Trả lời**: Kết quả trắc nghiệm được lưu thông qua API `POST /api/custom-decks/{id}/quiz-results`. Backend lấy `UserId` trực tiếp từ JWT Claim trong request header (không tin tưởng `userId` truyền từ Client), đảm bảo điểm số chỉ được lưu chính xác cho người dùng đang đăng nhập.

---

## 🏁 Kết Luận (Conclusion)
Dự án **JLearn** đã hoàn thiện đầy đủ các mục tiêu đề ra, đáp ứng tốt cả về khía cạnh kiến trúc phần mềm chuẩn mực (.NET 8 N-Tier + React TS), trải nghiệm người dùng hiện đại và khả năng mở rộng trong tương lai.
