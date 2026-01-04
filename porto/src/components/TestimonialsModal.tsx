import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonialsAPI, getUploadBaseURL } from "@/services/api";
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
                        src={`${getUploadBaseURL()}${testimonials[currentIndex].avatar_url}`}
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
