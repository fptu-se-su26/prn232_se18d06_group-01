# 🎬 Kịch Bản Thuyết Trình Bằng DEMO Trực Tiếp (Updated)
**Dự án JLearn - Nền tảng Học từ vựng & Kiểm tra Tiếng Nhật Trực tuyến**

---

## 📌 Tổng Quan Thuyết Trình
- **Hình thức**: Demo trực tiếp trên sản phẩm (Live Demo 100%, không dùng Slide).
- **Thời lượng dự kiến**: 5 - 7 phút (Demo thao tác 5 phút + Trả lời Q&A 2 phút).
- **Mục tiêu**: Làm nổi bật tính thực tiễn của sản phẩm, trải nghiệm UX/UI hiện đại (Dark mode, Phát âm giọng đọc 🔊, Clone 1-click 🧭), và kiến trúc backend chuẩn mực (.NET 8 N-Tier, Repository & Unit of Work, Docker).

---

## ⚙️ BƯỚC CHUẨN BỊ TRƯỚC KHU DEMO (1 phút)

1. **Khởi động Docker**:
   ```bash
   docker-compose up -d
   ```
2. **Trình duyệt**: Mở sẵn `http://localhost`.
3. **Đoạn văn bản từ vựng mẫu** (để dán thử tính năng Import từ vựng hàng loạt):
   ```text
   猫 (ねこ - Neko) - Con mèo
   犬 (いぬ - Inu) - Con chó
   食べる (たべる - Taberu) - Ăn (động từ)
   飲む (のむ - Nomu) - Uống (động từ)
   さようなら (Sayounara) - Tạm biệt
   ```

---

## 🎯 KỊCH BẢN THAO TÁC & CÂU THOẠI TỪNG BƯỚC (Demo Flow)

### 📌 BƯỚC 1: Đăng Ký & Giữ Phiên Đăng Nhập Khi F5 (1 phút)

- **Thao tác trên màn hình**:
  1. Mở `http://localhost/login`.
  2. Chọn sang tab **Đăng ký** $\rightarrow$ Nhập: Họ tên `Nguyễn Văn Học`, Email `learner1@gmail.com`, Mật khẩu `123456` $\rightarrow$ Bấm **Tạo tài khoản ngay**.
  3. Sau khi vào trang Dashboard, bấm nút **F5** (Tải lại trang).

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Kính chào Thầy Cô và Hội đồng. Sau đây em xin phép demo trực tiếp ứng dụng **JLearn** – Nền tảng học từ vựng và trắc nghiệm tiếng Nhật."*
  >
  > *"Đầu tiên là màn hình Authentication. Em vừa thực hiện tạo một tài khoản học viên mới. Ngay khi đăng ký thành công, Backend tự động cấp cặp JWT Access Token & Refresh Token để đưa người dùng thẳng vào trang chủ."*
  >
  > *(Khi nhấn F5)*: *"Hệ thống được thiết kế khởi tạo trạng thái Auth đồng bộ từ `localStorage`. Nhờ đó khi người dùng nhấn F5 hay tải lại trang, phiên làm việc vẫn được giữ nguyên mượt mà mà không bị đẩy văng về trang Đăng nhập."*

---

### 📌 BƯỚC 2: Tạo Bộ Thẻ Cá Nhân & Import Từ Vựng Hàng Loạt (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm vào mục **Thẻ cá nhân** trên Sidebar.
  2. Bấm **+ Tạo bộ thẻ mới** $\rightarrow$ Nhập tên *"Từ vựng N5 Lớp Học"* $\rightarrow$ Bấm **Tạo mới**.
  3. Bấm vào bộ thẻ vừa tạo $\rightarrow$ Chọn nút **Import từ CSV (Nhập nhiều từ)**.
  4. Dán đoạn từ vựng mẫu ở bước chuẩn bị vào khung $\rightarrow$ Bấm **Nhập danh sách**.

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Tiếp theo là chức năng quản lý học phần cá nhân. Bên cạnh việc tạo từng thẻ thủ công, JLearn hỗ trợ tính năng **Bulk Import** từ vựng."*
  >
  > *"Người học chỉ cần dán đoạn văn bản từ vựng dạng `Từ - Nghĩa`, hệ thống sẽ tự động tách và chèn hàng loạt thẻ vào CSDL chỉ trong 1 giây, tiết kiệm tối đa thời gian biên soạn bài học."*

---

### 📌 BƯỚC 3: Lật Thẻ Ôn Tập & Phát Âm Giọng Đọc 🔊 (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm nút **Học tự do (Lật thẻ)**.
  2. Bấm nút **Loa 🔊** ở góc thẻ $\rightarrow$ Hệ thống cất giọng phát âm tiếng Nhật `ja-JP`.
  3. Bấm chạm vào thẻ để lật xem mặt sau (Nghĩa tiếng Việt).

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Khi ôn tập, người học sử dụng chế độ **Lật thẻ (Preview Mode)** tương tác 3D trực quan."*
  >
  > *"Đặc biệt, hệ thống tích hợp công nghệ **Text-to-Speech (Web Speech API)** với biểu tượng nút loa 🔊. Khi bấm vào, trình duyệt sẽ cất giọng phát âm tiếng Nhật chuẩn `ja-JP` với tốc độ vừa phải, giúp người học vừa nhớ mặt chữ vừa luyện nghe âm thanh chuẩn xác."*

---

### 📌 BƯỚC 4: Trắc Nghiệm (Quiz Mode) & Lưu Lịch Sử Điểm (1 phút)

- **Thao tác trên màn hình**:
  1. Trở ra bấm nút **Kiểm tra (Quiz)**.
  2. Chọn Chế độ kiểm tra: *"Trộn (Ngẫu nhiên)"* $\rightarrow$ Bấm **Bắt đầu kiểm tra**.
  3. Bấm biểu tượng **Loa 🔊** ở câu hỏi để nghe âm thanh $\rightarrow$ Chọn các đáp án $\rightarrow$ Hoàn thành bài thi.
  4. Màn hình hiển thị kết quả % $\rightarrow$ Quay lại trang chi tiết bộ thẻ, cuộn xuống chỉ vào bảng **"Lịch sử làm bài trắc nghiệm gần đây"**.

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Để đánh giá mức độ thuộc bài, JLearn cung cấp chế độ **Trắc nghiệm (Quiz Mode)** với 3 tùy chọn: Nhật-Việt, Việt-Nhật hoặc Trộn ngẫu nhiên."*
  >
  > *"Khi làm xong, API `/api/custom-decks/{id}/quiz-results` ở Backend tự động tính tỉ lệ % câu đúng và lưu vào lịch sử làm bài. Người học có thể xem lại bảng tiến độ điểm số của mình ngay bên dưới."*

---

### 📌 BƯỚC 5: Khám Phá & Clone Bộ Thẻ Cộng Đồng 1-Click 🧭 (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm mục **🧭 Khám phá** trên Sidebar.
  2. Tìm kiếm bộ thẻ công khai của Admin $\rightarrow$ Bấm nút **Sao chép (Clone)** $\rightarrow$ Nút chuyển thành ✅ **Đã lưu**.
  3. Quay lại **Thẻ cá nhân** $\rightarrow$ Cho thấy bộ thẻ vừa clone đã nằm gọn trong kho của mình.

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Mô hình của JLearn hướng tới cộng đồng mở. Tại mục **Khám phá**, người học có thể tìm kiếm các bộ từ vựng được chia sẻ công khai bởi thành viên khác."*
  >
  > *"Chỉ với 1-click vào nút **Sao chép**, toàn bộ deck và các từ vựng bên trong sẽ được sao chép về kho cá nhân thông qua API `POST /clone` trong CSDL."*

---

### 📌 BƯỚC 6: Quản Trị Hệ Thống (Admin Dashboard) & Phân Quyền (1 phút)

- **Thao tác trên màn hình**:
  1. Bấm **Đăng xuất**.
  2. Đăng nhập tài khoản Admin: Email `admin@jlearn.com`, Mật khẩu `Admin@123`.
  3. Chọn mục **Quản trị Admin** (`/admin`) trên Sidebar.
  4. Cho xem các thẻ Thống kê (Users, Decks, Cards, Quizzes) $\rightarrow$ Thao tác bấm nút **Khóa / Mở khóa** tài khoản user.

- **Kịch bản thoại với Thầy Cô / Hội Đồng**:
  > *"Cuối cùng là trang **Admin Dashboard** dành riêng cho Quản trị viên."*
  >
  > *"Tất cả API Admin đều được bảo vệ nghiêm ngặt bằng JWT Role `[Authorize(Roles = "Admin")]`. Admin có thể theo dõi bức tranh thống kê toàn hệ thống real-time, quản lý phân quyền và khóa các tài khoản vi phạm."*

---

### 📌 BƯỚC 7: Tổng Kết Kỹ Thuật Ngắn Gọn (30 giây)

- **Kịch bản thoại kết thúc**:
  > *"Về mặt kỹ thuật, dự án JLearn được xây dựng trên nền tảng **.NET 8 Web API** áp dụng kiến trúc N-Tier, **Generic Repository & Unit of Work**, cơ chế **Xóa mềm (Soft Delete)** bảo toàn dữ liệu. Frontend xây dựng bằng **React 18 TypeScript** với **Tailwind CSS** hỗ trợ Dark Mode. Toàn bộ giải pháp được đóng gói và thực thi bằng **Docker Compose**."*
  >
  > *"Em xin cảm ơn Thầy Cô đã theo dõi bài demo của em!"*

---

## 🛡️ BỘ CÂU HỎI VẶN HỎI KỸ THUẬT THƯỜNG GẶP (Q&A Defense)

1. **❓ Thầy cô hỏi: "Tính năng phát âm Text-to-Speech hoạt động như thế nào?"**
   - **👉 Trả lời**: *"Dạ hệ thống sử dụng **Web Speech API (`window.speechSynthesis`)** tích hợp sẵn của trình duyệt. Khi người dùng bấm loa, Frontend làm sạch văn bản và gọi Engine tổng hợp giọng đọc tiếng Nhật `ja-JP` phát ra loa trực tiếp, không tốn băng thông hay lưu file ghi âm trên Server."*

2. **❓ Thầy cô hỏi: "Xóa dữ liệu trong app là xóa thật hay xóa mềm?"**
   - **👉 Trả lời**: *"Dạ hệ thống áp dụng **Xóa mềm (Soft Delete)**. Mọi Entity kế thừa `BaseEntity` có thuộc tính `IsDeleted`. Khi xóa, Backend chỉ cập nhật `IsDeleted = true`. Trong `AppDbContext` có cấu hình `Global Query Filter` tự động loại bỏ các bản ghi đã xóa khỏi mọi câu lệnh SELECT."*

3. **❓ Thầy cô hỏi: "Làm sao đảm bảo tính toàn vẹn dữ liệu khi Clone bộ thẻ gồm nhiều thẻ?"**
   - **👉 Trả lời**: *"Dạ Backend áp dụng **Unit of Work Pattern**. Thao tác tạo Deck mới và chèn danh sách Card clone đều dùng chung 1 `DbContext` và chỉ thực thi `SaveChangesAsync()` đúng 1 lần ở cuối. Nếu xảy ra sự cố giữa chừng, toàn bộ thao tác sẽ tự động Rollback."*

4. **❓ Thầy cô hỏi: "Xử lý Token hết hạn như thế nào?"**
   - **👉 Trả lời**: *"Dạ Frontend dùng **Axios Interceptor** (`api.ts`). Khi API trả về lỗi `401 Unauthorized`, Interceptor sẽ tự động gửi `RefreshToken` lên API `/auth/refresh-token` để xin lại `AccessToken` mới ngầm mà không làm ngắt quãng thao tác của người dùng."*
