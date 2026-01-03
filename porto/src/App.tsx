import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminIndex from "./pages/AdminIndex";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminContact from "./pages/admin/AdminContact";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSocialLinks from "./pages/admin/AdminSocialLinks";
import AdminCV from "./pages/admin/AdminCV";
import AdminAboutInfo from "./pages/admin/AdminAboutInfo";
import AdminHome from "./pages/admin/AdminHome";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminCertifications from "./pages/admin/AdminCertifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminIndex />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="experience" element={<AdminExperiences />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="settings" element={<AdminSettings />} />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="profile" element={<AdminHome />} />
            <Route path="timeline" element={<AdminExperiences />} />
            <Route path="about-info" element={<AdminAbout />} />
            <Route path="skills" element={<AdminAbout />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="social-links" element={<AdminSocialLinks />} />
            <Route path="cv" element={<AdminCV />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
