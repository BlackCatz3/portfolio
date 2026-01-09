import { motion } from "framer-motion";
import { ArrowRight, Download, Linkedin, Github, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { aboutAPI, contactAPI, analyticsAPI, getUploadBaseURL } from "@/services/api";

interface HeroSectionProps {
  onNavigate: (section: number) => void;
}

interface AboutData {
  name: string;
  title: string;
  bio: string;
  headline: string;
  profile_image: string;
  resume_url: string;
  skills: string[];
  availability_status: string;
}

interface ContactData {
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  whatsapp_url: string;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, contactResponse] = await Promise.all([
          aboutAPI.get(),
          contactAPI.get(),
        ]);
        setAbout(aboutResponse.data);
        setContact(contactResponse.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Track page view
    analyticsAPI.trackEvent({
      event_type: 'PAGE_VIEW',
      page: 'home'
    }).catch(err => console.error('Analytics tracking error:', err));
  }, []);

  const handleCVDownload = () => {
    // Track CV download
    analyticsAPI.trackEvent({
      event_type: 'CV_DOWNLOAD'
    }).catch(err => console.error('Analytics tracking error:', err));
  };

  const socialLinks = [
    { 
      icon: Github, 
      href: contact?.github_url || "#", 
      label: "GitHub", 
      color: "text-foreground",
      show: !!contact?.github_url 
    },
    { 
      icon: Linkedin, 
      href: contact?.linkedin_url || "#", 
      label: "LinkedIn", 
      color: "text-[#0A66C2]",
      show: !!contact?.linkedin_url 
    },
    { 
      icon: Twitter, 
      href: contact?.twitter_url || "#", 
      label: "Twitter", 
      color: "text-[#1DA1F2]",
      show: !!contact?.twitter_url 
    },
    { 
      icon: MessageCircle, 
      href: contact?.whatsapp_url || "#", 
      label: "WhatsApp", 
      color: "text-[#25D366]",
      show: !!contact?.whatsapp_url 
    },
  ].filter(link => link.show);

  return (
    <section className="slide-section relative flex items-center gradient-hero pt-20 md:pt-0 min-h-screen">
      <div className="container mx-auto px-6 py-8 pb-40 md:py-12 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Role Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{about?.title || 'UI/UX Designer & Developer'}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading leading-tight"
            >
              {about?.headline ? (
                about.headline.split('\n').map((line, index, array) => (
                  <span key={index}>
                    {line.includes('Experiences') || line.includes('Inspire') || line.includes('Solutions') ? (
                      <>
                        {line.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="text-gradient">{line.split(' ').slice(-1)}</span>
                      </>
                    ) : (
                      line
                    )}
                    {index < array.length - 1 && <br />}
                  </span>
                ))
              ) : (
                <>
                  Crafting Digital
                  <br />
                  <span className="text-gradient">Experiences</span>
                  <br />
                  That Inspire
                </>
              )}
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              {about?.bio || 'I design and develop beautiful, user-centric digital products that solve real problems and create lasting impressions.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={() => onNavigate(2)}
                className="group"
              >
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                className="group"
                asChild={!!about?.resume_url}
                onClick={about?.resume_url ? handleCVDownload : undefined}
              >
                {about?.resume_url ? (
                  <a 
                    href={
                      about.resume_url.startsWith('http://') || about.resume_url.startsWith('https://') 
                        ? about.resume_url 
                        : `${getUploadBaseURL()}${about.resume_url}`
                    } 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download CV
                  </>
                )}
              </Button>
            </motion.div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 pt-4"
              >
                <span className="text-sm text-muted-foreground">Follow me:</span>
                <div className="flex gap-2">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg bg-muted/50 ${color} hover:bg-muted hover:scale-110 transition-all`}
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Avatar/Illustration Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow Effect - Light & Dark Mode */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Primary glow */}
              <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-primary/30 dark:bg-primary/20 blur-3xl animate-pulse-glow" />
              {/* Secondary ambient glow */}
              <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-tr from-primary/40 via-primary/20 to-transparent dark:from-primary/25 dark:via-primary/10 blur-2xl animate-pulse" />
              {/* Accent light ring */}
              <div className="absolute w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full border border-primary/20 dark:border-primary/10 opacity-60" />
            </div>
            
            {/* Draggable Nametag */}
            <motion.div
              drag
              dragSnapToOrigin
              dragElastic={0.3}
              whileDrag={{ scale: 1.08, rotate: 8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ cursor: "grabbing" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 cursor-grab active:cursor-grabbing select-none"
            >
              {/* Nametag Card */}
              <div className="relative w-72 md:w-80 lg:w-96">
                {/* Lanyard Strap */}
                <div className="absolute -top-8 md:-top-20 left-1/2 -translate-x-1/2 w-3 md:w-6 h-8 md:h-20 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-primary/80 via-primary to-primary/90 rounded-t-sm" />
                  <div className="absolute inset-0 w-1 left-1/2 -translate-x-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
                
                {/* Lanyard Clip */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="relative">
                    {/* Clip Base */}
                    <div className="w-10 h-6 rounded-md bg-gradient-to-b from-zinc-300 to-zinc-400 dark:from-zinc-500 dark:to-zinc-600 shadow-md border border-zinc-400/50 dark:border-zinc-500/50" />
                    {/* Clip Ring */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 rounded-b-full border-4 border-zinc-400 dark:border-zinc-500 bg-transparent" />
                    {/* Clip Shine */}
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/40" />
                  </div>
                </div>
                
                {/* Neon Glow Effect */}
                <div className="absolute -inset-3 rounded-3xl bg-primary/40 dark:bg-primary/45 blur-2xl animate-pulse-glow -z-10" />
                <div className="absolute -inset-1 rounded-2xl bg-primary/25 dark:bg-primary/25 blur-xl -z-10" />
                
                {/* Main Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_hsl(var(--primary)/0.35)] dark:shadow-[0_0_40px_hsl(var(--primary)/0.35)] border border-primary/30 dark:border-primary/35 backdrop-blur-sm">
                  {/* Card Header Accent */}
                  <div className="h-2 gradient-primary" />
                  
                  <div className="bg-card/95 backdrop-blur-md p-6 md:p-8 space-y-5">
                    {/* Photo Area */}
                    <div className="flex justify-center -mt-2">
                      <div className="relative">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl gradient-primary p-0.5 rotate-3 shadow-lg shadow-primary/30">
                          <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center overflow-hidden">
                            {about?.profile_image ? (
                              <img 
                                src={`${getUploadBaseURL()}${about.profile_image}`} 
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-4xl">👤</div>
                            )}
                          </div>
                        </div>
                        {/* Status dot */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card shadow-md" />
                      </div>
                    </div>
                    
                    {/* Name */}
                    <div className="text-center space-y-1.5">
                      <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground tracking-tight">
                        {about?.name || 'Your Name'}
                      </h3>
                      <p className="text-sm md:text-base font-medium text-gradient">
                        {about?.title || 'UI/UX Designer & Developer'}
                      </p>
                    </div>
                    
                    {/* Decorative Divider */}
                    <div className="flex items-center gap-3 px-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
                    </div>
                    
                    {/* Skills Tags */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {(about?.skills || ['React', 'TypeScript', 'Figma']).map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Card Footer */}
                    <div className="pt-2 flex justify-center">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {about?.availability_status || 'Available for work'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Drag Hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1"
                >
                  <span className="inline-block animate-bounce">👆</span> Drag me around!
                </motion.p>
              </div>
              
              {/* Decorative Orbs */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-sm"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-6 w-10 h-10 rounded-full bg-gradient-to-tr from-primary/25 to-transparent blur-sm"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground">Scroll or use arrow keys</span>
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary"
        >
          <ArrowRight className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
