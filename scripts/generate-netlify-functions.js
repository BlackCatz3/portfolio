import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping dari routes ke controllers
const functionMappings = [
  // Experiences
  {
    name: 'experiences',
    controller: 'experiencesController',
    routes: {
      'GET /': 'getAllExperiences',
      'GET /:id': 'getExperience',
      'POST /': 'createExperience',
      'PUT /:id': 'updateExperience',
      'DELETE /:id': 'deleteExperience'
    },
    protected: ['POST', 'PUT', 'DELETE']
  },
  // About
  {
    name: 'about',
    controller: 'aboutController',
    routes: {
      'GET /': 'getAbout',
      'PUT /': 'updateAbout'
    },
    protected: ['PUT']
  },
  // About Info
  {
    name: 'about-info',
    controller: 'aboutInfoController',
    routes: {
      'GET /': 'getAboutInfo',
      'PUT /': 'updateAboutInfo'
    },
    protected: ['PUT']
  },
  // Contact
  {
    name: 'contact',
    controller: 'contactController',
    routes: {
      'GET /': 'getContact',
      'PUT /': 'updateContact'
    },
    protected: ['PUT']
  },
  // Blog
  {
    name: 'blog-posts',
    controller: 'blogController',
    routes: {
      'GET /': 'getAllPosts',
      'GET /:id': 'getPost',
      'GET /slug/:slug': 'getPostBySlug',
      'POST /': 'createPost',
      'PUT /:id': 'updatePost',
      'DELETE /:id': 'deletePost'
    },
    protected: ['POST', 'PUT', 'DELETE']
  },
  // Testimonials
  {
    name: 'testimonials',
    controller: 'testimonialsController',
    routes: {
      'GET /': 'getAllTestimonials',
      'GET /:id': 'getTestimonial',
      'POST /': 'createTestimonial',
      'PUT /:id': 'updateTestimonial',
      'DELETE /:id': 'deleteTestimonial'
    },
    protected: ['POST', 'PUT', 'DELETE']
  },
  // Newsletter
  {
    name: 'newsletter',
    controller: 'newsletterController',
    routes: {
      'GET /subscribers': 'getSubscribers',
      'POST /subscribe': 'subscribe',
      'POST /unsubscribe/:email': 'unsubscribe',
      'DELETE /subscribers/:id': 'deleteSubscriber'
    },
    protected: ['GET', 'DELETE']
  },
  // Skills
  {
    name: 'skills',
    controller: 'skillsController',
    routes: {
      'GET /': 'getAllSkills',
      'GET /:id': 'getSkill',
      'POST /': 'createSkill',
      'PUT /:id': 'updateSkill',
      'DELETE /:id': 'deleteSkill'
    },
    protected: ['POST', 'PUT', 'DELETE']
  },
  // Messages
  {
    name: 'messages',
    controller: 'messagesController',
    routes: {
      'GET /': 'getAllMessages',
      'GET /:id': 'getMessage',
      'POST /': 'createMessage',
      'PATCH /:id/status': 'updateMessageStatus',
      'DELETE /:id': 'deleteMessage'
    },
    protected: ['GET', 'PATCH', 'DELETE']
  },
  // Certifications
  {
    name: 'certifications',
    controller: 'certificationsController',
    routes: {
      'GET /': 'getAllCertifications',
      'GET /:id': 'getCertification',
      'POST /': 'createCertification',
      'PUT /:id': 'updateCertification',
      'DELETE /:id': 'deleteCertification'
    },
    protected: ['POST', 'PUT', 'DELETE']
  },
  // Analytics
  {
    name: 'analytics',
    controller: 'analyticsController',
    routes: {
      'POST /track': 'trackEvent',
      'GET /statistics': 'getStatistics',
      'GET /activities': 'getRecentActivities',
      'GET /chart': 'getChartData'
    },
    protected: ['GET']
  }
];

console.log('✅ Function mappings created');
console.log('📝 Total endpoints:', functionMappings.length);
console.log('\nNext steps:');
console.log('1. Review the mappings above');
console.log('2. Run conversion script to generate Netlify Functions');
console.log('3. Test each function locally with netlify dev');
console.log('4. Deploy to Netlify');
