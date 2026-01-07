import { motion } from "framer-motion";
import { Briefcase, Award, Trophy, Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { experiencesAPI, aboutAPI, certificationsAPI, getUploadBaseURL } from "@/services/api";

interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string;
}

interface Certification {
  id: number;
  title: string;
  issuer: string;
  year: string;
  icon_type: string;
  display_order: number;
  certificate_url?: string;
  image_url?: string;
}

export const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expResponse, aboutResponse, certResponse] = await Promise.all([
          experiencesAPI.getAll(),
          aboutAPI.get(),
          certificationsAPI.getAll(),
        ]);
        setExperiences(expResponse.data);
        setSkills(aboutResponse.data.skills || []);
        setCertifications(certResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching experience data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return Trophy;
      case 'medal':
        return Medal;
      default:
        return Award;
    }
  };

  if (loading) {
    return (
      <section className="slide-section relative bg-background">
        <div className="container mx-auto px-4 md:px-6 py-6 pb-32 md:py-12 md:pb-24">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }
  return (
    <section className="slide-section relative bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container mx-auto px-3 md:px-6 py-4 pb-20 md:py-8 md:pb-16 relative z-10">
        <div className="max-w-6xl mx-auto space-y-3 md:space-y-8 w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-1 md:space-y-2"
          >
            <span className="text-xs font-medium text-primary uppercase tracking-widest">Experience</span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-heading">
              My Journey & <span className="text-gradient">Expertise</span>
            </h2>
          </motion.div>

          {/* Certifications & Awards - Moved to top */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-2 md:space-y-4"
            >
              <h3 className="text-base md:text-xl font-heading text-center">Certifications & Awards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {certifications.map((cert, index) => {
                  const IconComponent = getIcon(cert.icon_type);
                  
                  if (cert.certificate_url) {
                    return (
                      <a
                        key={cert.id}
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 md:p-6 rounded-xl bg-card border border-border/50 text-center space-y-2 md:space-y-3 hover:border-primary/30 transition-colors"
                        >
                          {cert.image_url ? (
                            <img
                              src={`${getUploadBaseURL()}${cert.image_url}`}
                              alt={cert.title}
                              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg mx-auto"
                            />
                          ) : (
                            <IconComponent className="h-8 w-8 md:h-12 md:w-12 text-primary mx-auto" />
                          )}
                          <div>
                            <h4 className="text-sm md:text-base font-semibold">{cert.title}</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">{cert.issuer}</p>
                          </div>
                          <span className="text-xs md:text-sm text-primary font-medium">{cert.year}</span>
                        </motion.div>
                      </a>
                    );
                  }
                  
                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 md:p-6 rounded-xl bg-card border border-border/50 text-center space-y-2 md:space-y-3"
                    >
                      {cert.image_url ? (
                        <img
                          src={`${getUploadBaseURL()}${cert.image_url}`}
                          alt={cert.title}
                          className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <IconComponent className="h-8 w-8 md:h-12 md:w-12 text-primary mx-auto" />
                      )}
                      <div>
                        <h4 className="text-sm md:text-base font-semibold">{cert.title}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <span className="text-xs md:text-sm text-primary font-medium">{cert.year}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Timeline - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-1.5 md:space-y-4"
          >
            <h3 className="text-base md:text-xl font-heading text-center">Experience & Education</h3>
            <div className="relative max-w-3xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-3 md:left-6 top-0 bottom-0 w-px bg-border" />
              {/* Timeline End Dot */}
              <div className="absolute left-3 md:left-6 bottom-0 w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary -translate-x-[3px] md:-translate-x-[5px]" />
              
              <div className="space-y-1.5 md:space-y-4">
                {experiences.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative pl-8 md:pl-16"
                  >
                    {/* Icon */}
                    <div className="absolute left-0 md:left-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <Briefcase className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-1.5 md:p-4 rounded-lg bg-card border border-border/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] md:text-xs text-primary font-medium">
                          {formatDate(item.start_date)} - {item.is_current ? 'Present' : formatDate(item.end_date!)}
                        </span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">• {item.company}</span>
                        {item.location && (
                          <span className="text-[10px] md:text-xs text-muted-foreground">• {item.location}</span>
                        )}
                      </div>
                      <h4 className="text-xs md:text-sm font-semibold">{item.position}</h4>
                      {item.description && (
                        <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-2 md:space-y-3"
            >
              <h3 className="text-sm md:text-lg font-heading">Tech Stack</h3>
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                {skills.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
