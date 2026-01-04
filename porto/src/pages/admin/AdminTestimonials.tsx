import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonialsAPI, uploadAPI, projectsAPI, getUploadBaseURL } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    content: "",
    avatar_url: "",
    rating: 5,
    featured: false,
    order_index: 0,
    project_id: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testimonialsRes, projectsRes] = await Promise.all([
        testimonialsAPI.getAll(),
        projectsAPI.getAll(),
      ]);
      setTestimonials(testimonialsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, avatar_url: response.data.url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedTestimonial) {
        await testimonialsAPI.update(selectedTestimonial.id, formData);
        toast.success("Testimonial updated successfully");
      } else {
        await testimonialsAPI.create(formData);
        toast.success("Testimonial created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position || "",
      company: testimonial.company || "",
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || "",
      rating: testimonial.rating || 5,
      featured: testimonial.featured || false,
      order_index: testimonial.order_index || 0,
      project_id: testimonial.project_id || null,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await testimonialsAPI.delete(selectedTestimonial.id);
      toast.success("Testimonial deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const resetForm = () => {
    setSelectedTestimonial(null);
    setFormData({
      name: "",
      position: "",
      company: "",
      content: "",
      avatar_url: "",
      rating: 5,
      featured: false,
      order_index: 0,
      project_id: null,
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
          <h1 className="text-3xl font-heading font-bold">
            Testimonials Management
          </h1>
          <p className="text-muted-foreground">
            Manage client testimonials and reviews
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTestimonial
                  ? "Edit Testimonial"
                  : "Create New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g., CEO"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Tech Corp"
                />
              </div>

              <div>
                <Label htmlFor="project">Link to Project (Optional)</Label>
                <Select
                  value={formData.project_id?.toString() || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      project_id: value === "none" ? null : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Link this testimonial to a specific project. It will appear in the project's Reviews popup.
                </p>
              </div>

              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  required
                  placeholder="What did they say about you?"
                />
              </div>

              <div>
                <Label htmlFor="avatar">Avatar Image</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {formData.avatar_url && (
                  <img
                    src={`${getUploadBaseURL()}${formData.avatar_url}`}
                    alt="Avatar"
                    className="mt-2 w-16 h-16 object-cover rounded-full"
                  />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rating: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Star{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="order_index">Order</Label>
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
                </div>

                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: !!checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {selectedTestimonial ? "Update" : "Create"} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No testimonials yet</p>
            <Button onClick={openCreateDialog} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex gap-4">
                {testimonial.avatar_url && (
                  <img
                    src={`${getUploadBaseURL()}${testimonial.avatar_url}`}
                    alt={testimonial.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {testimonial.name}
                      </h3>
                      {testimonial.position && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          )
                        )}
                      </div>
                      <p className="mt-2 text-sm">{testimonial.content}</p>
                      <div className="flex gap-2 mt-2">
                        {testimonial.featured && (
                          <span className="inline-block text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        {testimonial.project_id && (
                          <span className="inline-block text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                            Linked to: {projects.find(p => p.id === testimonial.project_id)?.title || `Project #${testimonial.project_id}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedTestimonial(testimonial);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
              This will permanently delete the testimonial from "
              {selectedTestimonial?.name}". This action cannot be undone.
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

export default AdminTestimonials;
