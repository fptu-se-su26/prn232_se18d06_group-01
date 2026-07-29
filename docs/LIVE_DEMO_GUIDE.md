# 🎬 Kịch Bản Thuyết Trình Bằng DEMO Trực Tiếp (No Slides)
**Dự án JLearn - Nền tảng Học từ vựng & Kiểm tra Tiếng Nhật Trực tuyến**

---

## ⚙️ Chuẩn Bị Trước Khi Demo (1 phút)

1. **Khởi động Docker**: Đảm bảo các container đang chạy mượt mà bằng lệnh:
   ```bash
   docker-compose up -d
   ```
2. **Mở sẵn trình duyệt**: Truy cập `http://localhost`.
3. **Chuẩn bị đoạn văn bản từ vựng mẫu** (để dán thử tính năng Import hàng loạt):
   ```text
   猫 (ねこ - Neko) - Con mèo
   犬 (いぬ - Inu) - Con chó
   食べる (たべる - Taberu) - Ăn (động từ)
   飲む (のむ - Nomu) - Uống (động từ)
   本 (ほん - Hon) - Sách
   ```

---

## 🎯 Kịch Bản Thao Tác & Lời Nói Từng Bước (Demo Flow - 5 đến 7 phút)

### 📌 BƯỚC 1: Đăng ký & Cơ chế Giữ Phiên Đăng Nhập (1 phút)

- **Thao tác trên màn hình**:
  1. Truy cập `http://localhost/login`.
  2. Bấm sang tab **Đăng ký**.
  3. Nhập: Họ tên `Nguyễn Văn Học`, Email `learner1@gmail.com`, Mật khẩu `123456` $\rightarrow$ Bấm **Tạo tài khoản ngay**.
  4. Sau khi vào trang Dashboard, nhấn phím **F5** (Tải lại trang).

- **Lời nói với Thầy Cô / Hội Đồng**:
  > *"Kính chào thầy cô. Hôm nay em xin phép demo trực tiếp hệ thống **JLearn** – Nền tảng học từ vựng và trắc nghiệm tiếng Nhật."*
  >
  > *"Đầu tiên là màn hình Authentication. Em vừa thực hiện đăng ký một tài khoản học viên mới. Ngay khi đăng ký thành công, Backend tự động cấp cặp JWT Access Token và Refresh Token để đăng nhập thẳng vào hệ thống."*
  >
  > *(Khi nhấn F5)*: *"Hệ thống được thiết kế đọc trạng thái đăng nhập đồng bộ từ localStorage, nhờ đó khi người dùng nhấn F5 hay tải lại trang thì phiên làm việc vẫn được giữ nguyên mượt mà mà không bị đẩy văng về trang Đăng nhập."*

---

### 📌 BƯỚC 2: Tạo Bộ Thẻ Cá Nhân & Import Từ Vựng Hàng Loạt (1.5 phút)

- **Thao tác trên màn hình**:
  1. Bấm vào mục **Thẻ cá nhân** trên Sidebar.
  2. Bấm **+ Tạo bộ thẻ mới** $\rightarrow$ Đặt tên *"Từ vựng N5 Lớp Học"*, mô tả *"Bộ từ vựng ôn thi N5"* $\rightarrow$ Bấm **Tạo mới**.
  3. Bấm vào bộ thẻ vừa tạo $\rightarrow$ Chọn nút **Nhập nhiều từ vựng (Import)**.
  4. Dán đoạn văn bản mẫu chuẩn bị sẵn ở trên vào ô nhập $\rightarrow$ Bấm **Nhập danh sách**.

- **Lời nói với Thầy Cô / Hội Đồng**:
  > *"Tiếp theo là chức năng quản lý bộ thẻ cá nhân. Ngoài việc thêm từng từ vựng thủ công, JLearn hỗ trợ tính năng **Bulk Import**."*
  >
  > *"Người học chỉ cần dán đoạn danh sách từ vựng dạng `Từ vựng - Nghĩa`, hệ thống sẽ tự động phân tách và chèn hàng loạt thẻ vào cơ sở dữ liệu chỉ trong 1 giây, tiết kiệm tối đa thời gian soạn bài."*

---

### 📌 BƯỚC 3: Lật Thẻ Ôn Tập & Bài Kiểm Tra Trắc Nghiệm (1.5 phút)

- **Thao tác trên màn hình**:
  1. Trong trang chi tiết bộ thẻ, bấm **Ôn tập (Lật thẻ)** $\rightarrow$ Bấm lật mặt trước (Chữ Nhật) và mặt sau (Nghĩa tiếng Việt).
  2. Trở ra bấm nút **Làm bài trắc nghiệm (Quiz Mode)**.
  3. Chọn Chế độ kiểm tra: *"Trộn (Ngẫu nhiên)"* $\rightarrow$ Bấm **Bắt đầu làm bài**.
  4. Chọn các đáp án trắc nghiệm $\rightarrow$ Hoàn thành bài thi $\rightarrow$ Màn hình hiển thị kết quả % và Badge xanh *"Đã lưu kết quả vào lịch sử"*.
  5. Quay lại trang chi tiết bộ thẻ $\rightarrow$ Cuộn xuống mục **"Lịch sử làm bài trắc nghiệm gần đây"** để chỉ vào dòng điểm vừa làm.

- **Lời nói với Thầy Cô / Hội Đồng**:
  > *"Sau khi tạo thẻ, người học có 2 chế độ ôn luyện:"*
  > 1. *"Chế độ **Lật thẻ (Preview Mode)** tương tác trực quan giúp phản xạ ghi nhớ từ."*
  > 2. *"Chế độ **Trắc nghiệm (Quiz Mode)** với 3 tùy chọn: Nhật-Việt, Việt-Nhật hoặc Trộn ngẫu nhiên."*
  >
  > *"Khi hoàn thành bài trắc nghiệm, Backend API `/api/custom-decks/{id}/quiz-results` sẽ tự động tính phần trăm điểm số và lưu vào lịch sử làm bài. Người học có thể dễ dàng theo dõi sự tiến bộ của mình qua từng lần làm bài."*

---

### 📌 BƯỚC 4: Khám Phá & Clone Bộ Thẻ Cộng Đồng 1-Click (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm vào mục **🧭 Khám phá** trên Sidebar.
  2. Nhập từ khóa tìm kiếm (ví dụ: *"N4"*) vào thanh tìm kiếm.
  3. Tìm bộ thẻ *"Từ vựng N4 thông dụng"* của người dùng khác $\rightarrow$ Bấm nút **Sao chép (Clone)** $\rightarrow$ Nút chuyển sang trạng thái ✅ **Đã lưu**.
  4. Quay lại **Thẻ cá nhân** $\rightarrow$ Chỉ cho thầy cô thấy bộ thẻ *"Từ vựng N4 thông dụng (Bản sao)"* đã nằm gọn trong kho của mình.

- **Lời nói với Thầy Cô / Hội Đồng**:
  > *"Một điểm nổi bật khác của JLearn là tính năng **Khám phá Cộng đồng**."*
  >
  > *"Người dùng có thể chia sẻ công khai bộ thẻ của mình. Học viên khác khi vào mục Khám phá chỉ cần bấm **Sao chép (Clone)** là toàn bộ deck và các thẻ bên trong sẽ được sao chép về tài khoản cá nhân thông qua API `POST /clone` trong 1-click."*

---

### 📌 BƯỚC 5: Trang Quản Trị Hệ Thống (Admin Panel) (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm **Đăng xuất** ở góc dưới Sidebar.
  2. Đăng nhập bằng tài khoản Admin: Email `admin@jlearn.com`, Mật khẩu `Admin@123`.
  3. Bấm vào mục **Quản trị Admin** trên Sidebar.
  4. Cho xem các thẻ Thống kê (Tổng Users, Decks, Cards, Số bài Quiz) $\rightarrow$ Xem bảng Danh sách người dùng $\rightarrow$ Bấm thử nút **Khóa / Mở khóa** hoặc đổi Role của user.

- **Lời nói với Thầy Cô / Hội Đồng**:
  > *"Cuối cùng là giao diện **Admin Dashboard** dành cho Quản trị viên."*
  >
  > *"Tất cả API Admin đều được bảo vệ bởi middleware phân quyền JWT `[Authorize(Roles = "Admin")]`. Nếu tài khoản Learner cố truy cập sẽ bị chặn ngay lập tức."*
  >
  > *"Tại đây, Admin có thể theo dõi bức tranh tổng quan của ứng dụng qua các thẻ thống kê real-time, quản lý danh sách người dùng, thay đổi quyền hạn hoặc khóa tài khoản vi phạm."*

---

### 📌 BƯỚC 6: Tổng Kết Kỹ Thuật ngắn gọn (30 giây)

- **Lời nói kết thúc**:
  > *"Dự án JLearn được xây dựng trên công nghệ **.NET 8 Web API** chuẩn mô hình N-Tier, kết hợp **Generic Repository & Unit of Work**, tính năng **Xóa mềm (Soft Delete)** bảo toàn dữ liệu. Frontend xây dựng bằng **React 18 TypeScript** kết hợp **Tailwind CSS** hỗ trợ chế độ Dark Mode. Toàn bộ hệ thống được đóng gói và vận hành dễ dàng bằng **Docker Compose**."*
  >
  > *"Em xin cảm ơn Thầy Cô đã lắng nghe bài demo của em!"*

---

## 🛡️ Bảng Chuẩn Bị Câu Hỏi Vặn Hỏi (Q&A Defense)

| Thầy Cô Hỏi | Cách Trả Lời Ngắn Gọn & Thuyết Phục |
|---|---|
| **Xóa dữ liệu trong app là xóa thật hay xóa mềm?** | "Dạ hệ thống sử dụng **Xóa mềm (Soft Delete)** ạ. Tất cả Model đều kế thừa `BaseEntity` có trường `IsDeleted`. Khi bấm xóa, hệ thống chỉ gán `IsDeleted = true`, và EF Core có `Global Query Filter` tự bỏ qua dữ liệu này khi query." |
| **Khi Token hết hạn thì xử lý thế nào?** | "Dạ Frontend có **Axios Interceptor** ở file `api.ts`. Khi API trả về lỗi `401 Unauthorized`, Interceptor sẽ tự động âm thầm gửi `RefreshToken` lên API `/auth/refresh-token` để lấy `AccessToken` mới mà không làm gián đoạn thao tác của người dùng." |
| **Làm sao đảm bảo tính toàn vẹn khi Clone bộ thẻ gồm nhiều thẻ?** | "Dạ Backend áp dụng **Unit of Work Pattern**. Việc tạo Deck mới và chèn 20 thẻ clone đều dùng chung 1 DbContext và chỉ gọi `SaveChangesAsync()` 1 lần duy nhất ở cuối. Nếu xảy ra lỗi ở bất kỳ thẻ nào, toàn bộ thao tác sẽ được Rollback tự động." |
