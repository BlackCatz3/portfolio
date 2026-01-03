import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutAPI, uploadAPI } from "@/services/api";
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
    title: "",
    headline: "",
    bio: "",
    profile_image: "",
    resume_url: "",
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await aboutAPI.get();
      setHomeData({
        title: response.data.title || "",
        headline: response.data.headline || "",
        bio: response.data.bio || "",
        profile_image: response.data.profile_image || "",
        resume_url: response.data.resume_url || "",
        skills: response.data.skills || [],
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
      setHomeData({ ...homeData, profile_image: response.data.url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
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
    if (skillInput.trim() && homeData.skills.length < 3) {
      setHomeData({
        ...homeData,
        skills: [...homeData.skills, skillInput.trim()],
      });
      setSkillInput("");
    } else if (homeData.skills.length >= 3) {
      toast.error("Maximum 3 skills for nametag card");
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
                <Label htmlFor="skills">Skills Badge (Max 3)</Label>
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
                    disabled={homeData.skills.length >= 3}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim() || homeData.skills.length >= 3}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Skills displayed as badges in nametag card (maximum 3)
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
                    <img
                      src={`http://localhost:5000${homeData.profile_image}`}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-primary/20"
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
          <li>• <strong>Title</strong> - Badge and nametag card</li>
          <li>• <strong>Headline</strong> - Large text in center</li>
          <li>• <strong>Bio</strong> - Description below headline</li>
          <li>• <strong>Skills</strong> - Badge pills in nametag card (max 3)</li>
          <li>• <strong>Profile Image</strong> - Photo in nametag card</li>
          <li>• <strong>Resume URL</strong> - Download CV button</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
