# 🇯🇵 JLearn — Nền Tảng Học & Quản Lý Từ Vựng Tiếng Nhật Cá Nhân

## 📋 Tổng quan

**JLearn** là một ứng dụng Web học tiếng Nhật trực tuyến, được thiết kế để hỗ trợ người dùng tự tạo, quản lý và chia sẻ các bộ thẻ từ vựng tiếng Nhật theo nhu cầu cá nhân. Ứng dụng tập trung vào tính tự do học tập, hỗ trợ chế độ lật thẻ 3D trực quan và khả năng sao chép (clone) các bộ thẻ hữu ích từ cộng đồng.

---

## 🛠️ Tech Stack

| Thành phần | Công nghệ sử dụng |
|---|---|
| **Frontend** | React 18 (Vite), TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | .NET 8 (ASP.NET Core Web API), C# |
| **Database** | SQL Server (EF Core 8) |
| **Bảo mật & Auth** | JWT (Access Token + Refresh Token) |
| **Kiến trúc** | Layered (N-Tier) + Repository Pattern + Unit of Work |
| **Docker** | Hỗ trợ Dockerfile riêng cho từng phần và file Docker Compose chạy toàn hệ thống |

---

## 🚀 Tính năng chính

- **Quản lý bộ thẻ từ vựng cá nhân**: Thêm, sửa, xóa các bộ thẻ từ vựng tùy ý.
- **Chế độ Công khai & Chia sẻ**: Cho phép đặt bộ thẻ ở chế độ **Công khai (Public)** để chia sẻ với người dùng khác hoặc **Riêng tư (Private)**.
- **Khám phá & Sao chép (Clone Deck)**: Xem danh sách các bộ thẻ cộng đồng và dễ dàng sao chép về thư viện của riêng mình để chỉnh sửa và học.
- **Chỉnh sửa trực tiếp (Inline Editing)**: Chỉnh sửa nhanh từ vựng hoặc nghĩa của thẻ ngay trên bảng danh sách của trang chi tiết bộ thẻ mà không cần mở pop-up.
- **Nhập từ vựng hàng loạt (CSV Import)**: Hỗ trợ import hàng loạt từ vựng qua văn bản CSV tiêu chuẩn (hỗ trợ ngoặc kép bao quanh chuỗi và dấu phẩy).
- **Chế độ học tự do (Free Study Mode)**: Học từ vựng thông qua thẻ lật 3D tương tác. Hỗ trợ đầy đủ bộ phím tắt thân thiện:
  - `Phím cách (Space)`: Lật thẻ.
  - `Mũi tên phải (→) / Phím D`: Chuyển sang thẻ tiếp theo.
  - `Mũi tên trái (←) / Phím A`: Quay lại thẻ trước.

---

## 📁 Cấu trúc thư mục dự án

```
JLearn/
├── JLearn/                    # Backend - .NET 8 Web API
│   ├── Controllers/           # Các API Controller
│   ├── Models/                # Định nghĩa Entity Database
│   ├── Data/                  # DbContext và Seed dữ liệu mẫu
│   ├── DTOs/                  # Đối tượng truyền tải dữ liệu
│   ├── Services/              # Xử lý logic nghiệp vụ chính
│   ├── Repositories/          # Tầng tương tác với DB
│   ├── UnitOfWork/            # Quản lý giao dịch EF Core
│   └── Migrations/            # EF Core Migrations
├── jlearn-frontend/           # Frontend - React + Vite + TS
│   ├── src/
│   │   ├── components/        # Component tái sử dụng
│   │   ├── contexts/          # Auth Context quản lý đăng nhập
│   │   ├── layouts/           # Bố cục giao diện (Main Layout)
│   │   ├── pages/             # Trang chính (Dashboard, Decks, Detail, Preview)
│   │   └── services/          # Gọi API Axios
│   ├── Dockerfile
│   └── nginx.conf             # Cấu hình Nginx chạy production frontend
├── docs/                      # Nhật ký học tập và tài liệu sử dụng AI
├── docker-compose.yml         # File khởi động toàn bộ dự án bằng Docker
├── JLearn.sln
└── README.md
```

---

## ⚙️ Hướng dẫn cài đặt và khởi chạy

Dự án hỗ trợ chạy thông qua Docker Compose (khuyên dùng) hoặc chạy thủ công từng dịch vụ.

### Cách 1: Khởi chạy nhanh bằng Docker Compose (Khuyên dùng)

Yêu cầu máy tính đã cài đặt và khởi động **Docker Desktop**.

1. Tại thư mục gốc của dự án, chạy lệnh:
   ```bash
   docker-compose up -d --build
   ```
2. Sau khi Docker khởi chạy thành công, truy cập các địa chỉ sau:
   - **Frontend (Giao diện học)**: [http://localhost](http://localhost)
   - **Backend API (Swagger)**: [http://localhost:5225/swagger](http://localhost:5225/swagger)

---

### Cách 2: Khởi chạy thủ công từng phần

#### 1. Khởi động SQL Server
Chạy SQL Server thông qua Docker container:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=JLearn@2024!" -p 1433:1433 --name jlearn-db -d mcr.microsoft.com/mssql/server:2022-latest
```

#### 2. Khởi chạy Backend (.NET API)
```bash
cd JLearn
# Tạo database và apply migrations
dotnet ef database update
# Chạy dự án
dotnet run
```
*Backend API chạy tại địa chỉ: `http://localhost:5225`.*

#### 3. Khởi chạy Frontend (React)
```bash
cd jlearn-frontend
npm install
npm run dev
```
*Frontend chạy tại địa chỉ: `http://localhost:5173`.*

---

## 🔑 Tài khoản thử nghiệm (Seed Data)

Khi cơ sở dữ liệu khởi tạo lần đầu, các tài khoản và dữ liệu mẫu sau sẽ được tự động thêm vào:
* **Tài khoản dùng thử**: `admin@test.com` / Mật khẩu: `123`
* **Bộ thẻ công khai có sẵn**: Các bộ thẻ từ vựng tiếng Nhật mẫu (như từ vựng N5, N4) đã được thêm sẵn ở trạng thái Công khai để người dùng mới có thể xem và Clone ngay trên Dashboard.