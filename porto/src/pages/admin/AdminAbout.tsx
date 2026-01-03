import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutInfoAPI, skillsAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Skill {
  id?: number;
  name: string;
  level: number;
  category: string;
}

export const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [aboutData, setAboutData] = useState({
    title: "",
    bio: "",
  });

  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aboutResponse, skillsResponse] = await Promise.all([
        aboutInfoAPI.get(),
        skillsAPI.getAll(),
      ]);
      
      setAboutData({
        title: aboutResponse.data.title || "",
        bio: aboutResponse.data.bio || "",
      });
      setSkills(skillsResponse.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aboutInfoAPI.update(aboutData);
      toast.success("About info updated successfully");
    } catch (error) {
      toast.error("Failed to update about info");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    setSkills([...skills, { name: "", level: 50, category: "" }]);
  };

  const handleUpdateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const handleSaveSkill = async (skill: Skill, index: number) => {
    try {
      if (skill.id) {
        await skillsAPI.update(skill.id, skill);
        toast.success("Skill updated");
      } else {
        const response = await skillsAPI.create(skill);
        const updated = [...skills];
        updated[index] = response.data;
        setSkills(updated);
        toast.success("Skill created");
      }
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const handleDeleteSkill = async (skill: Skill, index: number) => {
    if (skill.id) {
      try {
        await skillsAPI.delete(skill.id);
        toast.success("Skill deleted");
      } catch (error) {
        toast.error("Failed to delete skill");
      }
    }
    setSkills(skills.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">About Section</h1>
        <p className="text-muted-foreground">
          Manage content displayed in About section (scroll down on homepage)
        </p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">About Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* About Info Tab */}
        <TabsContent value="info">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <form onSubmit={handleSaveAbout} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={aboutData.title}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, title: e.target.value })
                  }
                  placeholder="e.g., QA Engineer & Problem Solver"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea
                  id="bio"
                  value={aboutData.bio}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, bio: e.target.value })
                  }
                  rows={10}
                  placeholder='Use words like "passionate," "raising the bar," "creating solutions"...'
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Full bio displayed in About section
                </p>
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save About Info"}
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Manage skills with proficiency levels (0-100%)
              </p>
              <Button onClick={handleAddSkill} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {skills.map((skill, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Skill Name</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => handleUpdateSkill(index, "name", e.target.value)}
                      placeholder="e.g., Selenium"
                    />
                  </div>
                  <div>
                    <Label>Level (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => handleUpdateSkill(index, "level", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={skill.category}
                      onChange={(e) => handleUpdateSkill(index, "category", e.target.value)}
                      placeholder="e.g., Testing"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      onClick={() => handleSaveSkill(skill, index)}
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteSkill(skill, index)}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-500 mb-2">
          💡 What's displayed in About Section:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Title & Bio</strong> - From About Info tab</li>
          <li>• <strong>Skills with progress bars</strong> - From Skills tab</li>
          <li>• <strong>Email & Location</strong> - From Contact section</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminAbout;
