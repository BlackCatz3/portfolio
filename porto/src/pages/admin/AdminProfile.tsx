import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutAPI, uploadAPI, getUploadBaseURL } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [aboutData, setAboutData] = useState({
    title: "",
    bio: "",
    headline: "",
    profile_image: "",
    resume_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const aboutResponse = await aboutAPI.get();

      setAboutData({
        title: aboutResponse.data.title || "",
        bio: aboutResponse.data.bio || "",
        headline: aboutResponse.data.headline || "",
        profile_image: aboutResponse.data.profile_image || "",
        resume_url: aboutResponse.data.resume_url || "",
      });
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setAboutData({ ...aboutData, profile_image: response.data.url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aboutAPI.update(aboutData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
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
        <h1 className="text-3xl font-heading font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and bio
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <form onSubmit={handleSaveAbout} className="space-y-6">
          <div>
            <Label htmlFor="title">Title / Role</Label>
            <Input
              id="title"
              value={aboutData.title}
              onChange={(e) =>
                setAboutData({ ...aboutData, title: e.target.value })
              }
              placeholder="e.g., Creative Developer, Full Stack Engineer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed in Hero Section and About Section
            </p>
          </div>

          <div>
            <Label htmlFor="headline">Hero Headline</Label>
            <Textarea
              id="headline"
              value={aboutData.headline}
              onChange={(e) =>
                setAboutData({ ...aboutData, headline: e.target.value })
              }
              rows={3}
              placeholder="e.g., Crafting Digital Experiences That Inspire"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Main headline text displayed in Hero Section (Home page top). Use line breaks for multi-line headlines.
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio / About Me</Label>
            <Textarea
              id="bio"
              value={aboutData.bio}
              onChange={(e) =>
                setAboutData({ ...aboutData, bio: e.target.value })
              }
              rows={6}
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Short version for Hero Section, long version for About Section
            </p>
          </div>

          <div>
            <Label htmlFor="profile_image">Profile Image</Label>
            <Input
              id="profile_image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {aboutData.profile_image && (
              <img
                src={`${getUploadBaseURL()}${aboutData.profile_image}`}
                alt="Profile"
                className="mt-2 w-32 h-32 object-cover rounded-full"
              />
            )}
          </div>

          <div>
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input
              id="resume_url"
              value={aboutData.resume_url}
              onChange={(e) =>
                setAboutData({ ...aboutData, resume_url: e.target.value })
              }
              placeholder="/uploads/resume.pdf"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload your resume file or provide a URL
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Quick Links:</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Skills are managed in <a href="/admin/skills" className="text-primary hover:underline">Skills Management</a></li>
              <li>• Contact info is managed in <a href="/admin/contact" className="text-primary hover:underline">Contact Info</a></li>
              <li>• Social links are managed in <a href="/admin/social-links" className="text-primary hover:underline">Social Links</a></li>
            </ul>
          </div>

          <Button type="submit" disabled={saving || uploading}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
