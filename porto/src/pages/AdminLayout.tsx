import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import { logout } from "@/services/api";

export const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminSidebar onLogout={handleLogout} />
      <main className="ml-64 p-8 flex-1">
        <Outlet />
      </main>
      <div className="ml-64">
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
