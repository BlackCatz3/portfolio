import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { aboutAPI, contactAPI, skillsAPI, aboutInfoAPI } from "@/services/api";

interface AboutData {
  title: string;
  bio: string;
  skills: string[];
}

interface AboutInfoData {
  title: string;
  bio: string;
}

interface ContactData {
  email: string;
  location: string;
}

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

export const AboutSection = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [aboutInfo, setAboutInfo] = useState<AboutInfoData | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, aboutInfoResponse, contactResponse, skillsResponse] = await Promise.all([
          aboutAPI.get(),
          aboutInfoAPI.get(),
          contactAPI.get(),
          skillsAPI.getAll(),
        ]);
        setAbout(aboutResponse.data);
        setAboutInfo(aboutInfoResponse.data);
        setContact(contactResponse.data);
        setSkills(skillsResponse.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <section className="slide-section relative gradient-hero">
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
            <span className="text-xs md:text-sm font-medium text-primary uppercase tracking-widest">About Me</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading">
              {aboutInfo?.title || 'Passionate Creator'} &<br />
              <span className="text-gradient">Problem Solver</span>
            </h2>
          </motion.div>

          {/* Bio & Info */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                {aboutInfo?.bio || 'Passionate developer with expertise in building modern web applications.'}
              </p>
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                {contact?.location && (
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    <span className="text-muted-foreground">{contact.location}</span>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Mail className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    <span className="text-muted-foreground">{contact.email}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Skills with Progress Bars */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold">Skills & Expertise</h3>
              {skills && skills.length > 0 ? (
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-lg font-medium text-foreground">{skill.name}</span>
                        <span className="text-xl md:text-2xl font-bold text-foreground">{skill.level}%</span>
                      </div>
                      <div className="relative w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                about?.skills && about.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {about.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
