import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutAPI, uploadAPI } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AdminCV = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await aboutAPI.get();
      setResumeUrl(response.data.resume_url || "");
    } catch (error) {
      toast.error("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file); // Reuse upload endpoint
      setResumeUrl(response.data.url);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aboutAPI.update({ resume_url: resumeUrl });
      toast.success("Resume URL updated successfully");
    } catch (error) {
      toast.error("Failed to update resume URL");
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
        <h1 className="text-3xl font-heading font-bold">CV / Resume Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your CV/Resume file
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="resume_file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Resume (PDF)
            </Label>
            <Input
              id="resume_file"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload your resume in PDF format (max 10MB)
            </p>
          </div>

          {/* Or Manual URL */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div>
            <Label htmlFor="resume_url" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Resume URL
            </Label>
            <Input
              id="resume_url"
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/resume.pdf or /uploads/resume.pdf"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide a direct link to your resume file
            </p>
          </div>

          {/* Preview */}
          {resumeUrl && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Current Resume</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {resumeUrl}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resumeUrl.startsWith('http') ? resumeUrl : `http://localhost:5000${resumeUrl}`, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          )}

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Your resume will be available for download on your portfolio's hero section.
            </p>
          </div>

          <Button type="submit" disabled={saving || uploading}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Resume"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminCV;
