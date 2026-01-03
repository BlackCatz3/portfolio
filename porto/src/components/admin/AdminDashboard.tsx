import { motion } from "framer-motion";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  Plus,
  Upload,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { icon: FolderKanban, label: "Projects", value: "12", trend: "+2 this month", color: "text-blue-500" },
  { icon: FileText, label: "Blog Posts", value: "8", trend: "+1 this week", color: "text-green-500" },
  { icon: MessageSquare, label: "Messages", value: "24", trend: "3 unread", color: "text-orange-500" },
  { icon: Eye, label: "Page Views", value: "1.2k", trend: "+15%", color: "text-purple-500" },
];

const quickActions = [
  { icon: Plus, label: "New Project", href: "/admin/projects", color: "bg-blue-500/10 text-blue-500" },
  { icon: FileText, label: "Write Post", href: "/admin/blog", color: "bg-green-500/10 text-green-500" },
  { icon: Upload, label: "Upload CV", href: "/admin/cv", color: "bg-orange-500/10 text-orange-500" },
  { icon: Settings, label: "Settings", href: "/admin/settings", color: "bg-purple-500/10 text-purple-500" },
];

const recentActivities = [
  { action: "Created new project", item: "E-Commerce Platform", time: "2 hours ago" },
  { action: "Updated profile", item: "Bio and avatar", time: "5 hours ago" },
  { action: "Published blog post", item: "Design Trends 2026", time: "1 day ago" },
  { action: "Replied to message", item: "John from TechCorp", time: "2 days ago" },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-primary-foreground"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome back, Admin! 👋</h1>
          <p className="text-primary-foreground/80 max-w-lg">
            Here's what's happening with your portfolio today. You have 3 new messages waiting for your response.
          </p>
          <div className="flex gap-3 mt-6">
            <Button className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0">
              View Messages
            </Button>
            <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              View Portfolio
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-primary mt-2">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 p-6 rounded-xl bg-card border border-border/50"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group"
              >
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Profile Completeness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 rounded-xl bg-card border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Profile Completeness</h2>
            <p className="text-sm text-muted-foreground">Complete your profile to attract more visitors</p>
          </div>
          <span className="text-2xl font-bold text-primary">75%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500">✓ Profile photo</span>
          <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500">✓ Bio</span>
          <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500">✓ Projects</span>
          <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500">○ CV upload</span>
          <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500">○ Testimonials</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
