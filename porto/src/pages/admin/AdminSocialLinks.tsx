import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Linkedin, Github, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AdminSocialLinks = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await contactAPI.get();
      setSocialLinks({
        linkedin_url: response.data.linkedin_url || "",
        github_url: response.data.github_url || "",
        twitter_url: response.data.twitter_url || "",
      });
    } catch (error) {
      toast.error("Failed to fetch social links");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await contactAPI.update(socialLinks);
      toast.success("Social links updated successfully");
    } catch (error) {
      toast.error("Failed to update social links");
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
        <h1 className="text-3xl font-heading font-bold">Social Links</h1>
        <p className="text-muted-foreground">
          Manage your social media profiles and links
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                type="url"
                value={socialLinks.linkedin_url}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub URL
              </Label>
              <Input
                id="github_url"
                type="url"
                value={socialLinks.github_url}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url" className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter URL
              </Label>
              <Input
                id="twitter_url"
                type="url"
                value={socialLinks.twitter_url}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, twitter_url: e.target.value })
                }
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> These social links will appear in your portfolio's hero section and footer.
            </p>
          </div>

          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Social Links"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminSocialLinks;
