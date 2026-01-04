import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutAPI, uploadAPI, getUploadBaseURL } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [homeData, setHomeData] = useState({
    name: "",
    title: "",
    headline: "",
    bio: "",
    profile_image: "",
    resume_url: "",
    skills: [] as string[],
    availability_status: "",
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await aboutAPI.get();
      setHomeData({
        name: response.data.name || "",
        title: response.data.title || "",
        headline: response.data.headline || "",
        bio: response.data.bio || "",
        profile_image: response.data.profile_image || "",
        resume_url: response.data.resume_url || "",
        skills: response.data.skills || [],
        availability_status: response.data.availability_status || "Available for work",
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
      const newImageUrl = response.data.url;
      
      // Update state
      const updatedData = { ...homeData, profile_image: newImageUrl };
      setHomeData(updatedData);
      
      // Auto-save to database
      await aboutAPI.update(updatedData);
      
      // Refresh data from server to ensure consistency
      await fetchData();
      
      toast.success("Image uploaded and saved successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aboutAPI.update(homeData);
      toast.success("Home section updated successfully");
    } catch (error) {
      toast.error("Failed to update home section");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setHomeData({
        ...homeData,
        skills: [...homeData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setHomeData({
      ...homeData,
      skills: homeData.skills.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Home Section</h1>
        <p className="text-muted-foreground">
          Manage content displayed in Home/Hero section (top of homepage)
        </p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media & CV</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={homeData.name}
                  onChange={(e) =>
                    setHomeData({ ...homeData, name: e.target.value })
                  }
                  placeholder="e.g., John Doe, Jane Smith"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your full name displayed in nametag card
                </p>
              </div>

              <div>
                <Label htmlFor="title">Title / Role</Label>
                <Input
                  id="title"
                  value={homeData.title}
                  onChange={(e) =>
                    setHomeData({ ...homeData, title: e.target.value })
                  }
                  placeholder="e.g., QA Engineer, Full Stack Developer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Displayed in badge and nametag card
                </p>
              </div>

              <div>
                <Label htmlFor="headline">Hero Headline</Label>
                <Textarea
                  id="headline"
                  value={homeData.headline}
                  onChange={(e) =>
                    setHomeData({ ...homeData, headline: e.target.value })
                  }
                  rows={3}
                  placeholder="e.g., Crafting Digital Experiences That Inspire"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Main headline text. Use line breaks for multi-line headlines.
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea
                  id="bio"
                  value={homeData.bio}
                  onChange={(e) =>
                    setHomeData({ ...homeData, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Short bio displayed below headline..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Short description (1-2 sentences) displayed in Hero section
                </p>
              </div>

              <div>
                <Label htmlFor="skills">Skills Badge</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g., SQL, Selenium, JavaScript"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Skills displayed as badges in nametag card (all skills will be shown)
                </p>
                {homeData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="availability_status">Availability Status</Label>
                <Input
                  id="availability_status"
                  value={homeData.availability_status}
                  onChange={(e) =>
                    setHomeData({ ...homeData, availability_status: e.target.value })
                  }
                  placeholder="e.g., Available for work, Open to opportunities"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Status text displayed below photo in nametag card
                </p>
              </div>

              <Button type="submit" disabled={saving || uploading}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Content"}
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Media & CV Tab */}
        <TabsContent value="media">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="profile_image">Profile Image</Label>
                <Input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {homeData.profile_image && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Image URL: {`${getUploadBaseURL()}${homeData.profile_image}`}
                    </p>
                    <img
                      src={`${getUploadBaseURL()}${homeData.profile_image}`}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-primary/20"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        console.error('Image URL:', `${getUploadBaseURL()}${homeData.profile_image}`);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', `${getUploadBaseURL()}${homeData.profile_image}`);
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Displayed in nametag card on Home section
                </p>
              </div>

              <div>
                <Label htmlFor="resume_url">Resume / CV URL</Label>
                <Input
                  id="resume_url"
                  value={homeData.resume_url}
                  onChange={(e) =>
                    setHomeData({ ...homeData, resume_url: e.target.value })
                  }
                  placeholder="/uploads/resume.pdf or https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your resume file or provide a URL. Used for "Download CV" button.
                </p>
              </div>

              <Button type="submit" disabled={saving || uploading}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Media"}
              </Button>
            </form>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-500 mb-2">
          💡 What's displayed in Home Section:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Name</strong> - Your full name in nametag card</li>
          <li>• <strong>Title</strong> - Badge and nametag card</li>
          <li>• <strong>Headline</strong> - Large text in center</li>
          <li>• <strong>Bio</strong> - Description below headline</li>
          <li>• <strong>Skills Badge</strong> - Badge pills in nametag card (all will be shown)</li>
          <li>• <strong>Availability Status</strong> - Status text below photo</li>
          <li>• <strong>Profile Image</strong> - Photo in nametag card</li>
          <li>• <strong>Resume URL</strong> - Download CV button</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-blue-500/20">
          <p className="text-sm font-medium text-blue-500 mb-2">
            ℹ️ Skills Badge vs Tech Stack:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Skills Badge</strong> (here) - Simple badges in nametag card on Home section</li>
            <li>• <strong>Tech Stack</strong> (Admin {'->'} Skills) - Detailed skills with progress bars in About section</li>
            <li>• These are <strong>separate</strong> - edit each one independently!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
