# 📊 Testimonials Pindah ke Projects - Implementation Guide

## ✅ Yang Sudah Selesai

### 1. Database Migration
- ✅ File: `backend/src/database/add-project-to-testimonials.sql`
- ✅ File: `backend/src/database/migrate-project-testimonials.js`
- ✅ Menambahkan field `project_id` ke tabel `testimonials`
- ✅ Menambahkan foreign key ke tabel `projects`
- ✅ Menambahkan index untuk performa

### 2. Backend API Update
- ✅ File: `backend/src/controllers/testimonialsController.js`
- ✅ Support filter by `project_id` di GET endpoint
- ✅ Support `project_id` di CREATE endpoint
- ✅ Support `project_id` di UPDATE endpoint

### 3. AdminAbout Update
- ✅ File: `porto/src/pages/admin/AdminAbout.tsx`
- ✅ Hapus tab "Testimonials"
- ✅ Sekarang hanya 2 tabs: "About Info" dan "Skills"
- ✅ Hapus import dan state untuk testimonials

---

## 🔧 Yang Perlu Dilakukan

### Step 1: Jalankan Migration Database

**Terminal:**
```bash
cd backend
node src/database/migrate-project-testimonials.js
```

**Expected Output:**
```
Adding project_id to testimonials table...
✅ Migration completed successfully!
Testimonials table now has project_id field
```

---

### Step 2: Update AdminProjects

Tambahkan management testimonials di AdminProjects dengan cara:

**Option A: Tambah Dialog/Modal untuk Testimonials**
- Setiap project card punya tombol "Manage Testimonials"
- Klik tombol → buka dialog dengan list testimonials untuk project tersebut
- Bisa add/edit/delete testimonials dalam dialog

**Option B: Tambah Tab di Edit Project Dialog**
- Saat edit project, ada tab "Testimonials"
- Tab ini menampilkan testimonials untuk project tersebut
- Bisa manage testimonials langsung dari sini

**Rekomendasi: Option A** (lebih sederhana dan terpisah)

---

### Step 3: Update Frontend ProjectsSection

Tambahkan tombol "Testimonials" di project card:

**Lokasi:** `porto/src/components/portfolio/ProjectsSection.tsx`

**Perubahan:**
```tsx
// Di project card, sebelah tombol Demo dan GitHub
<div className="flex gap-2">
  {project.project_url && (
    <Button>
      <ExternalLink /> Demo
    </Button>
  )}
  {project.github_url && (
    <Button>
      <Github /> Code
    </Button>
  )}
  {/* TAMBAH INI */}
  <Button onClick={() => handleShowTestimonials(project.id)}>
    <MessageSquare /> Testimonials
  </Button>
</div>
```

---

### Step 4: Buat Testimonials Popup/Modal

**Buat Component Baru:** `porto/src/components/TestimonialsModal.tsx`

**Features:**
- Fetch testimonials by project_id
- Display testimonials dengan rating stars
- Show avatar, name, position, company
- Show testimonial content
- Carousel/slider jika ada multiple testimonials
- Close button

**Props:**
```tsx
interface TestimonialsModalProps {
  projectId: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 📋 Detailed Implementation Steps

### A. Update AdminProjects - Add Testimonials Management

**File:** `porto/src/pages/admin/AdminProjects.tsx`

**Changes Needed:**

1. **Import testimonials API:**
```tsx
import { projectsAPI, uploadAPI, testimonialsAPI } from "@/services/api";
```

2. **Add state for testimonials:**
```tsx
const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
const [projectTestimonials, setProjectTestimonials] = useState([]);
const [isTestimonialsDialogOpen, setIsTestimonialsDialogOpen] = useState(false);
```

3. **Add function to fetch testimonials:**
```tsx
const fetchProjectTestimonials = async (projectId: number) => {
  try {
    const response = await testimonialsAPI.getAll({ project_id: projectId });
    setProjectTestimonials(response.data);
  } catch (error) {
    toast.error("Failed to fetch testimonials");
  }
};
```

4. **Add button in project card:**
```tsx
<Button
  size="sm"
  variant="outline"
  onClick={() => {
    setSelectedProjectId(project.id);
    fetchProjectTestimonials(project.id);
    setIsTestimonialsDialogOpen(true);
  }}
>
  <MessageSquare className="h-4 w-4 mr-2" />
  Testimonials
</Button>
```

5. **Add Testimonials Dialog:**
```tsx
<Dialog open={isTestimonialsDialogOpen} onOpenChange={setIsTestimonialsDialogOpen}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>Manage Testimonials</DialogTitle>
    </DialogHeader>
    {/* Testimonials management UI here */}
  </DialogContent>
</Dialog>
```

---

### B. Update ProjectsSection - Add Testimonials Button

**File:** `porto/src/components/portfolio/ProjectsSection.tsx`

**Changes Needed:**

1. **Import icons:**
```tsx
import { ExternalLink, Github, MessageSquare } from "lucide-react";
```

2. **Add state for modal:**
```tsx
const [selectedProject, setSelectedProject] = useState<number | null>(null);
const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);
```

3. **Add button in project card:**
```tsx
{/* After Demo and GitHub buttons */}
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    setSelectedProject(project.id);
    setIsTestimonialsOpen(true);
  }}
>
  <MessageSquare className="h-4 w-4 mr-2" />
  Testimonials
</Button>
```

4. **Add modal component:**
```tsx
{isTestimonialsOpen && selectedProject && (
  <TestimonialsModal
    projectId={selectedProject}
    projectTitle={projects.find(p => p.id === selectedProject)?.title || ""}
    isOpen={isTestimonialsOpen}
    onClose={() => setIsTestimonialsOpen(false)}
  />
)}
```

---

### C. Create TestimonialsModal Component

**File:** `porto/src/components/TestimonialsModal.tsx`

**Full Implementation:**

```tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonialsAPI } from "@/services/api";
import { toast } from "sonner";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar_url: string;
}

interface TestimonialsModalProps {
  projectId: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TestimonialsModal = ({
  projectId,
  projectTitle,
  isOpen,
  onClose,
}: TestimonialsModalProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchTestimonials();
    }
  }, [isOpen, projectId]);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll({ project_id: projectId });
      setTestimonials(response.data);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold mb-2">Testimonials</h2>
            <p className="text-muted-foreground">{projectTitle}</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No testimonials yet for this project</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Testimonial Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonials[currentIndex].rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-lg leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {testimonials[currentIndex].avatar_url ? (
                      <img
                        src={`http://localhost:5000${testimonials[currentIndex].avatar_url}`}
                        alt={testimonials[currentIndex].name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">
                          {testimonials[currentIndex].name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].position} at {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

---

## 🎯 Summary

### Perubahan Struktur:

**SEBELUM:**
```
AdminAbout
├─ About Info
├─ Skills
└─ Testimonials  ← Testimonials di sini (SALAH!)
```

**SESUDAH:**
```
AdminAbout
├─ About Info
└─ Skills

AdminProjects
├─ Project List
└─ Each Project → [Manage Testimonials Button]
                      ↓
                  Testimonials Dialog
                  (Add/Edit/Delete testimonials for this project)

Frontend Projects Section
├─ Project Cards
└─ Each Card → [Demo] [Code] [Testimonials]
                                    ↓
                              Testimonials Popup
                              (Show testimonials for this project)
```

---

## 📝 Next Steps

1. ✅ **Run Migration** - `node backend/src/database/migrate-project-testimonials.js`
2. ⏳ **Update AdminProjects** - Add testimonials management dialog
3. ⏳ **Create TestimonialsModal** - Create the popup component
4. ⏳ **Update ProjectsSection** - Add testimonials button
5. ⏳ **Test** - Verify everything works

---

## 🔗 API Endpoints

### Get Testimonials by Project
```
GET /api/testimonials?project_id=1
```

### Create Testimonial for Project
```
POST /api/testimonials
Body: {
  name: "John Doe",
  position: "CEO",
  company: "Tech Corp",
  content: "Great work!",
  rating: 5,
  avatar_url: "/uploads/avatar.jpg",
  project_id: 1  ← Link to project
}
```

### Update Testimonial
```
PUT /api/testimonials/:id
Body: {
  ...fields,
  project_id: 1
}
```

---

**Status: Backend & Database ✅ | Frontend Implementation ⏳**
