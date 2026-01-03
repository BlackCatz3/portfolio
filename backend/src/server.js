import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import experiencesRoutes from './routes/experiences.js';
import aboutRoutes from './routes/about.js';
import aboutInfoRoutes from './routes/aboutInfoRoutes.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import blogRoutes from './routes/blogRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import certificationsRoutes from './routes/certificationsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Import database
import pool from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root endpoint - Welcome page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Portfolio CMS API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login',
      projects: '/api/projects',
      experiences: '/api/experiences',
      about: '/api/about',
      contact: '/api/contact',
      upload: '/api/upload',
      blog: '/api/blog/posts',
      testimonials: '/api/testimonials'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio CMS API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/about-info', aboutInfoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Test database connection and start server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
  
  console.log('✅ Database connected successfully');
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation:`);
    console.log(`   - Health: GET http://localhost:${PORT}/health`);
    console.log(`   - Auth: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - Projects: http://localhost:${PORT}/api/projects`);
    console.log(`   - Experiences: http://localhost:${PORT}/api/experiences`);
    console.log(`   - About: http://localhost:${PORT}/api/about`);
    console.log(`   - Contact: http://localhost:${PORT}/api/contact`);
    console.log(`   - Upload: POST http://localhost:${PORT}/api/upload`);
    console.log(`   - Blog: http://localhost:${PORT}/api/blog/posts`);
  });
});
