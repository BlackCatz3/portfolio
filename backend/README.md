# Portfolio CMS Backend API

Backend API untuk Portfolio CMS menggunakan Node.js, Express, dan PostgreSQL.

## 🚀 Fitur

- ✅ Autentikasi admin dengan JWT
- ✅ CRUD Projects (portfolio items)
- ✅ CRUD Experiences (work history)
- ✅ Manage About section
- ✅ Manage Contact information
- ✅ Upload gambar
- ✅ RESTful API
- ✅ PostgreSQL database

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

Buat database PostgreSQL:

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE portfolio_cms;

# Keluar
\q
```

### 3. Configure Environment

Copy file `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_cms
DB_USER=postgres
DB_PASSWORD=your_password

ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
```

### 4. Run Database Migration

```bash
npm run db:migrate
```

Ini akan membuat semua tabel dan data default.

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "email": "admin@portfolio.com",
    "name": "Admin"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

### Projects

#### Get All Projects
```http
GET /api/projects
```

#### Get Single Project
```http
GET /api/projects/:id
```

#### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project description",
  "image_url": "/uploads/image.jpg",
  "project_url": "https://project.com",
  "github_url": "https://github.com/user/repo",
  "technologies": ["React", "Node.js"],
  "category": "Web Development",
  "featured": true,
  "order_index": 0
}
```

#### Update Project (Protected)
```http
PUT /api/projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer {token}
```

### Experiences

#### Get All Experiences
```http
GET /api/experiences
```

#### Create Experience (Protected)
```http
POST /api/experiences
Authorization: Bearer {token}
Content-Type: application/json

{
  "company": "Company Name",
  "position": "Position Title",
  "description": "Job description",
  "start_date": "2023-01-01",
  "end_date": "2024-01-01",
  "is_current": false,
  "location": "City, Country",
  "order_index": 0
}
```

#### Update Experience (Protected)
```http
PUT /api/experiences/:id
Authorization: Bearer {token}
```

#### Delete Experience (Protected)
```http
DELETE /api/experiences/:id
Authorization: Bearer {token}
```

### About

#### Get About Info
```http
GET /api/about
```

#### Update About (Protected)
```http
PUT /api/about
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Creative Developer",
  "bio": "Your bio here",
  "profile_image": "/uploads/profile.jpg",
  "resume_url": "/uploads/resume.pdf",
  "skills": ["React", "Node.js", "PostgreSQL"]
}
```

### Contact

#### Get Contact Info
```http
GET /api/contact
```

#### Update Contact (Protected)
```http
PUT /api/contact
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "contact@example.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "linkedin_url": "https://linkedin.com/in/username",
  "github_url": "https://github.com/username",
  "twitter_url": "https://twitter.com/username"
}
```

### Upload

#### Upload Image (Protected)
```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

image: [file]
```

Response:
```json
{
  "message": "Image uploaded successfully",
  "url": "/uploads/filename.jpg",
  "filename": "filename.jpg"
}
```

## 🔒 Security

- Password di-hash menggunakan bcrypt
- JWT untuk autentikasi
- Protected routes memerlukan valid token
- File upload dibatasi hanya gambar (max 5MB)
- CORS dikonfigurasi untuk frontend URL

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── projectsController.js
│   │   ├── experiencesController.js
│   │   ├── aboutController.js
│   │   ├── contactController.js
│   │   └── uploadController.js
│   ├── database/
│   │   ├── schema.sql           # Database schema
│   │   └── migrate.js           # Migration script
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload config
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── experiences.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   └── upload.js
│   └── server.js                # Main server file
├── uploads/                     # Uploaded files
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | portfolio_cms |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| ADMIN_EMAIL | Default admin email | admin@portfolio.com |
| ADMIN_PASSWORD | Default admin password | admin123 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:8080 |

## 🚨 Important Notes

1. **Ganti password default** setelah login pertama kali
2. **Ganti JWT_SECRET** di production dengan string random yang kuat
3. **Backup database** secara berkala
4. Jangan commit file `.env` ke git

## 📝 License

MIT
