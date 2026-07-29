# 🇯🇵 JLearn — Modern Japanese Vocabulary Learning & Management Platform

## 📋 Overview

**JLearn** is a full-stack, enterprise-grade web application designed to help users create, manage, and share Japanese vocabulary decks. Built with modern technologies and clean architecture, JLearn emphasizes interactive learning through 3D flashcards, community sharing, and a robust Admin dashboard for system management.

This project was built to demonstrate proficiency in modern **C# .NET 8**, **React 19**, **SQL Server**, and **Docker**, aligning with industry best practices such as N-Tier Architecture, Clean Code, and secure RESTful APIs.

---

## 🛠️ Tech Stack

| Component | Technologies Used |
|---|---|
| **Frontend** | React 19 (Vite), TypeScript, Tailwind CSS v4, Lucide Icons, Axios |
| **Backend** | .NET 8 (ASP.NET Core Web API), C# |
| **Database** | SQL Server 2022, Entity Framework Core 8 |
| **Security & Auth** | JSON Web Tokens (JWT), Role-Based Access Control (RBAC), BCrypt |
| **Architecture** | N-Tier Architecture, Repository Pattern, Unit of Work, Dependency Injection |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🚀 Key Features

### 👨‍🎓 For Learners
- **Deck Management**: Create, edit, and delete personal vocabulary decks.
- **Interactive Flashcards**: Study using 3D flipping flashcards with intuitive keyboard shortcuts (Space to flip, Arrows to navigate).
- **Quiz System**: Auto-generate multiple-choice quizzes (JP-VI, VI-JP, Mixed) and track scores.
- **Community Explore**: Browse public decks created by other users and clone them to your personal library.
- **Bulk Import**: Quickly import hundreds of vocabulary words using standard CSV format.
- **Inline Editing**: Fast, spreadsheet-like editing directly from the deck detail page.

### 🛡️ For Administrators
- **Admin Dashboard**: Comprehensive overview of system statistics (Total Users, Decks, Quiz Attempts) with a modern UI.
- **User Management**: Change user roles, lock/unlock accounts, or soft-delete abusive users.
- **Content Moderation**: Review and delete public decks that violate community guidelines.

---

## 📁 Project Structure

```text
JLearn/
├── JLearn/                    # Backend - .NET 8 Web API
│   ├── Controllers/           # RESTful API Endpoints
│   ├── Models/                # Entity Framework Core Models
│   ├── Data/                  # DbContext & Automatic Data Seeding
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Services/              # Business Logic Layer
│   ├── Repositories/          # Data Access Layer (Generic Repository)
│   ├── UnitOfWork/            # Transaction Management
│   └── Migrations/            # EF Core Migrations
├── jlearn-frontend/           # Frontend - React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   ├── contexts/          # Global State (AuthContext)
│   │   ├── pages/             # Main Views (Dashboard, Admin, Quiz)
│   │   └── services/          # API Integration (Axios Interceptors)
│   ├── Dockerfile             # Multi-stage build with Nginx
├── docker-compose.yml         # Container Orchestration
└── README.md
```

---

## ⚙️ Getting Started

The easiest way to run the project is using **Docker Compose**.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Quick Start (Docker)

1. Clone the repository and navigate to the root directory.
2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```
3. Access the application:
   - **Frontend (Web App)**: [http://localhost](http://localhost)
   - **Backend API (Swagger UI)**: [http://localhost:5225/swagger](http://localhost:5225/swagger)

---

## 🔑 Demo Accounts (Auto-Seeded)

When the database is initialized, it automatically seeds the following accounts:

* **Admin Account**: `admin@jlearn.com` / Password: `Admin@123`
* **Test Account**: `admin@test.com` / Password: `123`

*Note: Public sample decks (N5, N4 vocabulary) are also auto-seeded for immediate testing of the Explore feature.*