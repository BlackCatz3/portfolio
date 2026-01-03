import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutInfoAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const AdminAboutInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [aboutInfoData, setAboutInfoData] = useState({
    title: "",
    bio: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await aboutInfoAPI.get();
      setAboutInfoData({
        title: response.data.title || "",
        bio: response.data.bio || "",
      });
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aboutInfoAPI.update(aboutInfoData);
      toast.success("About Section updated successfully");
    } catch (error) {
      toast.error("Failed to update About Section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">About Section Info</h1>
        <p className="text-muted-foreground">
          Manage content displayed in About Section (scroll down on homepage)
        </p>
      </div>

      {/* Info Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3"
      >
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-500">
            About Section vs Home Section
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Home Section</strong> (Hero): Data dikelola di <a href="/admin/profile" className="text-primary hover:underline">Home Section → Profile</a></li>
            <li>• <strong>About Section</strong>: Data dikelola di halaman ini (About Section → About Info)</li>
            <li>• Skills dikelola di <a href="/admin/skills" className="text-primary hover:underline">About Section → Skills</a></li>
            <li>• Email & Location dikelola di <a href="/admin/contact" className="text-primary hover:underline">Contact Section → Contact Info</a></li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={aboutInfoData.title}
              onChange={(e) =>
                setAboutInfoData({ ...aboutInfoData, title: e.target.value })
              }
              placeholder="e.g., QA Engineer & Problem Solver"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed as the main title in About Section
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea
              id="bio"
              value={aboutInfoData.bio}
              onChange={(e) =>
                setAboutInfoData({ ...aboutInfoData, bio: e.target.value })
              }
              rows={10}
              placeholder='Use words like "passionate," "raising the bar," "creating solutions," "building trust," and "transforming challenges." Tell your complete story here...'
            />
            <p className="text-xs text-muted-foreground mt-1">
              Full bio displayed in About Section. Write as much detail as you want.
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">💡 What's displayed in About Section:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Title</strong> - From this page</li>
              <li>• <strong>Bio</strong> - From this page (full text)</li>
              <li>• <strong>Email & Location</strong> - From <a href="/admin/contact" className="text-primary hover:underline">Contact Info</a></li>
              <li>• <strong>Skills with progress bars</strong> - From <a href="/admin/skills" className="text-primary hover:underline">Skills</a></li>
            </ul>
          </div>

          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save About Section"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAboutInfo;
