import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Award, Trophy, Medal, Upload, ExternalLink } from "lucide-react";
import { certificationsAPI, uploadAPI, getUploadBaseURL } from "@/services/api";
import { toast } from "sonner";

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    year: "",
    icon_type: "award",
    display_order: 0,
    certificate_url: "",
    image_url: "",
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await certificationsAPI.getAll();
      setCertifications(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch certifications");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, image_url: response.data.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await certificationsAPI.update(editingId, formData);
        toast.success("Certification updated successfully");
      } else {
        await certificationsAPI.create(formData);
        toast.success("Certification created successfully");
      }
      
      resetForm();
      fetchCertifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save certification");
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      icon_type: cert.icon_type,
      display_order: cert.display_order,
      certificate_url: cert.certificate_url || "",
      image_url: cert.image_url || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    
    try {
      await certificationsAPI.delete(id);
      toast.success("Certification deleted successfully");
      fetchCertifications();
    } catch (error) {
      toast.error("Failed to delete certification");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      issuer: "",
      year: "",
      icon_type: "award",
      display_order: 0,
      certificate_url: "",
      image_url: "",
    });
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="h-8 w-8 text-primary" />;
      case 'medal':
        return <Medal className="h-8 w-8 text-primary" />;
      default:
        return <Award className="h-8 w-8 text-primary" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Certifications & Awards</h1>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Certification" : "Add New Certification"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="AWS Certified Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2023"
                  maxLength={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon_type">Icon Type</Label>
                <select
                  id="icon_type"
                  value={formData.icon_type}
                  onChange={(e) => setFormData({ ...formData, icon_type: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="award">Award</option>
                  <option value="trophy">Trophy</option>
                  <option value="medal">Medal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate_url">Certificate URL (Optional)</Label>
                <Input
                  id="certificate_url"
                  value={formData.certificate_url}
                  onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Certificate Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={`${getUploadBaseURL()}${formData.image_url}`}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update" : "Create"} Certification
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <Card key={cert.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                {cert.image_url ? (
                  <img
                    src={`${getUploadBaseURL()}${cert.image_url}`}
                    alt={cert.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  getIcon(cert.icon_type)
                )}
                <div>
                  <h3 className="font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <span className="text-sm text-primary font-medium">{cert.year}</span>
                {cert.certificate_url && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Certificate
                  </a>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cert)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No certifications yet. Add your first certification above.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
