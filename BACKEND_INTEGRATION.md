# Backend Integration Guide

Panduan lengkap untuk mengintegrasikan backend API dengan frontend React.

## 🎯 Overview

Backend API sudah dibuat dengan struktur:
- **Framework:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer
- **Port:** 5000 (default)

## 📁 Struktur Project

```
porto/                          # Frontend React
backend/                        # Backend API
├── src/
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & upload
│   ├── config/                # Database config
│   └── server.js              # Main server
├── uploads/                   # Uploaded images
└── .env                       # Configuration
```

## 🚀 Quick Start

### 1. Setup PostgreSQL

```bash
# Buat database
psql -U postgres
CREATE DATABASE portfolio_cms;
\q
```

### 2. Configure Backend

```bash
cd backend

# Edit .env file (sesuaikan DB_PASSWORD)
# DB_PASSWORD=your_postgres_password

# Install dependencies (sudah dilakukan)
npm install

# Run migration
npm run db:migrate

# Start server
npm run dev
```

Backend akan running di: **http://localhost:5000**

### 3. Test API

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'
```

## 🔌 Frontend Integration

### Install Axios di Frontend

```bash
cd porto
npm install axios
```

### Create API Service

Buat file `porto/src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Experiences API
export const experiencesAPI = {
  getAll: () => api.get('/experiences'),
  getOne: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`),
};

// About API
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

// Contact API
export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
```

### Example: Login Component

```javascript
import { useState } from 'react';
import { authAPI } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Example: Fetch Projects

```javascript
import { useEffect, useState } from 'react';
import { projectsAPI } from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <img src={`http://localhost:5000${project.image_url}`} alt={project.title} />
        </div>
      ))}
    </div>
  );
}
```

### Example: Create Project (Admin)

```javascript
import { useState } from 'react';
import { projectsAPI, uploadAPI } from '../services/api';

function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_url: '',
    github_url: '',
    technologies: [],
    category: '',
    featured: false,
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Upload image first
      let imageUrl = '';
      if (image) {
        const uploadResponse = await uploadAPI.uploadImage(image);
        imageUrl = uploadResponse.data.url;
      }

      // Create project
      await projectsAPI.create({
        ...formData,
        image_url: imageUrl,
      });

      alert('Project created successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

## 🔐 Authentication Flow

1. User login dengan email & password
2. Backend return JWT token
3. Simpan token di localStorage
4. Kirim token di header untuk protected routes
5. Backend verify token untuk setiap request

```javascript
// Check if user is logged in
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  window.location.href = '/login';
};

// Protected Route Component
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login admin |
| GET | /api/auth/profile | Yes | Get admin profile |
| POST | /api/auth/change-password | Yes | Change password |
| GET | /api/projects | No | Get all projects |
| POST | /api/projects | Yes | Create project |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |
| GET | /api/experiences | No | Get all experiences |
| POST | /api/experiences | Yes | Create experience |
| PUT | /api/experiences/:id | Yes | Update experience |
| DELETE | /api/experiences/:id | Yes | Delete experience |
| GET | /api/about | No | Get about info |
| PUT | /api/about | Yes | Update about |
| GET | /api/contact | No | Get contact info |
| PUT | /api/contact | Yes | Update contact |
| POST | /api/upload | Yes | Upload image |

## 🎨 Image URLs

Semua gambar yang diupload bisa diakses via:
```
http://localhost:5000/uploads/filename.jpg
```

Di frontend, gunakan:
```javascript
<img src={`http://localhost:5000${project.image_url}`} />
```

## 🔧 Environment Variables

Backend `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_cms
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:8080
```

## 🚨 Common Issues

### CORS Error
Pastikan `FRONTEND_URL` di backend `.env` sesuai dengan URL frontend Anda.

### 401 Unauthorized
Token expired atau invalid. User perlu login ulang.

### 404 Not Found
Cek endpoint URL dan method HTTP sudah benar.

### Database Connection Error
Pastikan PostgreSQL running dan credentials di `.env` benar.

## 📝 Next Steps

1. ✅ Setup PostgreSQL database
2. ✅ Run migration: `npm run db:migrate`
3. ✅ Start backend: `npm run dev`
4. ⏳ Buat API service di frontend
5. ⏳ Integrasikan login page
6. ⏳ Fetch data dari API
7. ⏳ Implement CRUD operations di admin panel

## 🎯 Production Deployment

Untuk production:
1. Ganti `JWT_SECRET` dengan string random yang kuat
2. Ganti password admin default
3. Setup PostgreSQL di production server
4. Update `FRONTEND_URL` dengan domain production
5. Enable HTTPS
6. Setup proper logging
7. Configure backup untuk database

Selamat coding! 🚀
