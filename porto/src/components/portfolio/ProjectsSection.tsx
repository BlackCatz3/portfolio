import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { projectsAPI, analyticsAPI, getUploadBaseURL } from "@/services/api";
import { TestimonialsModal } from "@/components/TestimonialsModal";

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string[];
  category: string;
  featured: boolean;
}

interface ProjectsSectionProps {
  isActive?: boolean;
}

export const ProjectsSection = ({ isActive = false }: ProjectsSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<{ id: number; title: string } | null>(null);
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleShowTestimonials = (project: Project) => {
    setSelectedProject({ id: project.id, title: project.title });
    setIsTestimonialsOpen(true);
    
    // Track project view
    analyticsAPI.trackEvent({
      event_type: 'PROJECT_VIEW',
      project_id: project.id
    }).catch(err => console.error('Analytics tracking error:', err));
  };

  // Auto-close modal when user navigates away from Projects section
  useEffect(() => {
    if (!isActive && isTestimonialsOpen) {
      setIsTestimonialsOpen(false);
      setSelectedProject(null);
    }
  }, [isActive]);

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  if (loading) {
    return (
      <section className="slide-section relative bg-background">
        <div className="container mx-auto px-4 md:px-6 py-6 pb-32 md:py-12 md:pb-24">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="slide-section relative bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6 pb-32 md:py-12 md:pb-24">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2 md:space-y-4"
          >
            <span className="text-xs md:text-sm font-medium text-primary uppercase tracking-widest">Portfolio</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              A selection of my best work, showcasing design thinking and technical expertise.
            </p>
          </motion.div>

          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {featuredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-xl md:rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Thumbnail Area - Compact on mobile */}
                <div className="aspect-[16/10] md:aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                  {project.image_url ? (
                    <img 
                      src={`${getUploadBaseURL()}${project.image_url}`} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                      📁
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Hover Actions - Always visible on mobile */}
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex gap-2 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                    {project.project_url && (
                      <Button size="sm" variant="hero" className="flex-1 h-8 md:h-9 text-xs md:text-sm" asChild>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button size="sm" variant="outline" className="flex-1 h-8 md:h-9 text-xs md:text-sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 md:h-4 md:w-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 md:h-9 text-xs md:text-sm"
                      onClick={() => handleShowTestimonials(project)}
                    >
                      <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                      Reviews
                    </Button>
                  </div>
                </div>

                {/* Content - Compact on mobile */}
                <div className="p-3 md:p-6 space-y-2 md:space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {project.category && (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {project.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Stack - Hidden on mobile for compact view */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="hidden md:flex flex-wrap gap-2 pt-2 border-t border-border/50">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Other Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <h3 className="text-lg md:text-2xl font-heading text-center">Other Projects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {otherProjects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.project_url || '#'}
                  target={project.project_url ? "_blank" : undefined}
                  rel={project.project_url ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group p-3 md:p-6 rounded-lg md:rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2 md:mb-4">
                    {project.image_url ? (
                      <img 
                        src={`${getUploadBaseURL()}${project.image_url}`} 
                        alt={project.title}
                        className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl">📁</span>
                    )}
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Modal */}
      {selectedProject && (
        <TestimonialsModal
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
          isOpen={isTestimonialsOpen}
          onClose={() => setIsTestimonialsOpen(false)}
        />
      )}
    </section>
  );
};

export default ProjectsSection;
