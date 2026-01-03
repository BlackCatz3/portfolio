import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
  ChevronRight,
  Home,
  UserCircle,
  Clock,
  Folder,
  Phone,
  MessageSquare,
  Award,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  submenu?: { icon: any; label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Home, label: "Home", href: "/admin/home" },
  { icon: UserCircle, label: "About", href: "/admin/about" },
  { icon: Clock, label: "Experience", href: "/admin/experience" },
  { icon: Award, label: "Certifications", href: "/admin/certifications" },
  { icon: Folder, label: "Projects", href: "/admin/projects" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
  { icon: Phone, label: "Contact", href: "/admin/contact" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: Users, label: "Newsletter", href: "/admin/newsletter" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  onLogout: () => void;
}

export const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-sidebar-foreground">Portfolio</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.href}
                to={item.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMenuItem"
                    className="absolute inset-0 bg-sidebar-primary rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 relative z-10")} />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto relative z-10" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
