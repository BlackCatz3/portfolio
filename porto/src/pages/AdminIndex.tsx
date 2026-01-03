import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Briefcase, User, Mail, TrendingUp } from "lucide-react";
import { projectsAPI, experiencesAPI, aboutAPI, contactAPI } from "@/services/api";

export const AdminIndex = () => {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, experiencesRes, aboutRes] = await Promise.all([
          projectsAPI.getAll(),
          experiencesAPI.getAll(),
          aboutAPI.get(),
        ]);

        setStats({
          projects: projectsRes.data.length,
          experiences: experiencesRes.data.length,
          skills: aboutRes.data.skills?.length || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ ...stats, loading: false });
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Experiences",
      value: stats.experiences,
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  if (stats.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/projects"
            className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <FolderKanban className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Manage Projects</h3>
            <p className="text-sm text-muted-foreground">Add or edit projects</p>
          </a>
          <a
            href="/admin/timeline"
            className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <Briefcase className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Manage Experience</h3>
            <p className="text-sm text-muted-foreground">Update work history</p>
          </a>
          <a
            href="/admin/profile"
            className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <User className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Edit Profile</h3>
            <p className="text-sm text-muted-foreground">Update about section</p>
          </a>
          <a
            href="/admin/settings"
            className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <Mail className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">Account settings</p>
          </a>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Portfolio Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm">Projects Published</span>
            <span className="font-semibold">{stats.projects}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm">Work Experiences</span>
            <span className="font-semibold">{stats.experiences}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm">Skills Listed</span>
            <span className="font-semibold">{stats.skills}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminIndex;

