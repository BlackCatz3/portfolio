import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { skillsAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedSkill) {
        await skillsAPI.update(selectedSkill.id, formData);
        toast.success("Skill updated successfully");
      } else {
        await skillsAPI.create(formData);
        toast.success("Skill created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category || "",
      order_index: skill.order_index || 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await skillsAPI.delete(selectedSkill.id);
      toast.success("Skill deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
      fetchSkills();
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  const resetForm = () => {
    setSelectedSkill(null);
    setFormData({
      name: "",
      level: 50,
      category: "",
      order_index: 0,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tech Stack Management</h1>
          <p className="text-muted-foreground">
            Manage your technical skills with proficiency levels (displayed in About section)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., React / Next.js"
                  required
                />
              </div>

              <div>
                <Label htmlFor="level">
                  Proficiency Level: {formData.level}%
                </Label>
                <Slider
                  id="level"
                  value={[formData.level]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value[0] })
                  }
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Frontend, Backend, Design"
                />
              </div>

              <div>
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedSkill ? "Update" : "Create"} Skill
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-500 mb-2">
          ℹ️ Tech Stack vs Skills Badge:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Tech Stack</strong> (here) - Detailed skills with progress bars displayed in <strong>About section</strong></li>
          <li>• <strong>Skills Badge</strong> (Admin {'->'} Home) - Simple badge pills in nametag card on <strong>Home section</strong></li>
          <li>• These are <strong>completely separate</strong> - changes here won't affect Skills Badge and vice versa</li>
          <li>• Use this page to showcase your technical proficiency with percentage levels</li>
        </ul>
      </div>

      {/* Skills List with Progress Bars */}
      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No skills added yet</p>
            <Button onClick={openCreateDialog} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                    <span className="text-2xl font-bold text-primary">
                      {skill.level}%
                    </span>
                  </div>
                  {skill.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {skill.category}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(skill)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedSkill(skill);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill "{selectedSkill?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSkills;
