# 🇯🇵 JLearn — Nền tảng Học Tiếng Nhật Trực tuyến

## 📋 Tổng quan

JLearn là một Web Application học tiếng Nhật trực tuyến, cung cấp lộ trình học tập qua các bài học được cấu trúc sẵn (Minna no Nihongo, JLPT N5-N1). Ứng dụng tập trung vào việc tối ưu hóa khả năng ghi nhớ từ vựng thông qua thuật toán **Lặp lại ngắt quãng (Spaced Repetition)** và đánh giá năng lực qua hệ thống **trắc nghiệm**.

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Axios |
| **Backend** | .NET 8 (ASP.NET Core Web API), C# |
| **Database** | SQL Server (EF Core 8) |
| **Auth** | JWT (Access Token + Refresh Token) |
| **Architecture** | Layered (N-Tier) + Repository Pattern + Unit of Work |

## 👥 Thành viên nhóm

| STT | Họ tên | MSSV | Vai trò |
|-----|--------|------|---------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

> ⚠️ *Vui lòng cập nhật thông tin thành viên nhóm.*

## 🚀 Tính năng chính

- **Quản lý khóa học**: Danh sách khóa học JLPT N5-N1, bài học theo chương
- **Học từ vựng**: Hiển thị Kanji, Kana, Romaji, nghĩa tiếng Việt
- **Học ngữ pháp**: Cấu trúc, giải thích, ví dụ minh họa
- **Flashcard 3D**: Lật thẻ ôn tập với thuật toán Spaced Repetition (5 cấp độ)
- **Trắc nghiệm**: Hệ thống quiz chấm điểm server-side (chống gian lận)
- **Theo dõi tiến độ**: Dashboard cá nhân, thống kê từ vựng đã học
- **Admin CMS**: Quản lý CRUD nội dung khóa học

## 📁 Cấu trúc dự án

```
JLearn/
├── JLearn/                    # Backend - .NET 8 Web API
│   ├── Controllers/           # API Controllers
│   ├── Models/                # Entity Models
│   ├── Data/                  # DbContext & Seeder
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Services/              # Business Logic
│   ├── Repositories/          # Data Access Layer
│   ├── UnitOfWork/            # Unit of Work Pattern
│   ├── Helpers/               # JWT Helper, Utilities
│   ├── Middleware/             # Exception Middleware
│   └── Migrations/            # EF Core Migrations
├── docs/                      # Tài liệu dự án
│   ├── AI_AUDIT_LOG.md        # Nhật ký sử dụng AI
│   ├── PROMPTS.md             # Các prompt đã dùng với AI
│   ├── REFLECTION.md          # Phản ánh & đánh giá
│   └── CHANGELOG.md           # Lịch sử thay đổi
├── .gitignore
├── JLearn.sln
└── README.md
```

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (cho SQL Server)
- [Node.js 18+](https://nodejs.org/) (cho Frontend)

### Backend

```bash
# 1. Khởi động SQL Server Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=JLearn@2024!" \
  -p 1433:1433 --name jlearn-db \
  -d mcr.microsoft.com/mssql/server:2022-latest

# 2. Chạy Migration
cd JLearn
dotnet ef database update

# 3. Chạy Backend
dotnet run --urls="http://localhost:5000"
```

### Truy cập

- **Swagger UI**: http://localhost:5000/swagger
- **Admin Account**: `admin@jlearn.com` / `Admin@123`

## 🌿 Git Workflow

Dự án sử dụng mô hình **Git Flow**:

```
main                    ← Production (stable)
├── develop             ← Integration branch
│   ├── feature/*       ← Feature branches
│   ├── docs/*          ← Documentation branches
│   └── bugfix/*        ← Bug fix branches
```

**Quy trình:**
1. Checkout từ `develop` → tạo branch `feature/ten-tinh-nang`
2. Code + commit theo convention
3. Push branch → tạo **Pull Request** vào `develop`
4. Review → Merge
5. Khi stable → merge `develop` vào `main`

## 📝 Quy định sử dụng AI

Nhóm **bắt buộc** ghi lại quá trình sử dụng AI vào 4 file trong thư mục `docs/`:

| File | Mô tả |
|------|--------|
| [`docs/AI_AUDIT_LOG.md`](docs/AI_AUDIT_LOG.md) | Nhật ký: prompt, kết quả AI, phần sử dụng, phần chỉnh sửa, minh chứng |
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | Tổng hợp các prompt đã dùng |
| [`docs/REFLECTION.md`](docs/REFLECTION.md) | Phản ánh: AI giúp gì, hạn chế, bài học |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Lịch sử thay đổi theo từng phiên làm việc |

## 📄 License

Dự án phục vụ mục đích học tập — Môn PRN232 — FPT University.