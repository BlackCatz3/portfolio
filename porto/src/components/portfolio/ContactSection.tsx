import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { contactAPI, aboutAPI, messagesAPI } from "@/services/api";

interface ContactData {
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
}

interface AboutData {
  resume_url: string;
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactResponse, aboutResponse] = await Promise.all([
          contactAPI.get(),
          aboutAPI.get(),
        ]);
        setContact(contactResponse.data);
        setAbout(aboutResponse.data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contactInfo = contact ? [
    {
      icon: Mail,
      label: "Email",
      value: contact.email || "hello@portfolio.dev",
      href: `mailto:${contact.email || "hello@portfolio.dev"}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: contact.location || "Jakarta, Indonesia",
      href: "#",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact.phone || "+62 812 3456 7890",
      href: `tel:${contact.phone?.replace(/\s/g, '') || "+6281234567890"}`,
    },
  ] : [];

  const socialLinks = contact ? [
    { 
      icon: Github, 
      href: contact.github_url || "#", 
      label: "GitHub",
      visible: !!contact.github_url 
    },
    { 
      icon: Linkedin, 
      href: contact.linkedin_url || "#", 
      label: "LinkedIn",
      visible: !!contact.linkedin_url 
    },
    { 
      icon: Twitter, 
      href: contact.twitter_url || "#", 
      label: "Twitter",
      visible: !!contact.twitter_url 
    },
  ].filter(link => link.visible) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await messagesAPI.create(formData);
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDownloadCV = () => {
    if (about?.resume_url) {
      // If it's a full URL, open in new tab
      if (about.resume_url.startsWith('http')) {
        window.open(about.resume_url, '_blank');
      } else {
        // If it's a file path, download it
        const link = document.createElement('a');
        link.href = `http://localhost:5000${about.resume_url}`;
        link.download = 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      toast.error("CV not available");
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
      <div className="container mx-auto px-4 md:px-6 py-6 pb-32 md:py-12 md:pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Contact</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading">
              Let's Work <span className="text-gradient">Together</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 bg-card border-border/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 bg-card border-border/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="min-h-[150px] bg-card border-border/50 focus:border-primary resize-none"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">Follow me on social media</p>
                <div className="flex gap-3">
                  {socialLinks.length > 0 ? (
                    socialLinks.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-card border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                        aria-label={label}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No social links available</p>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-2xl gradient-primary text-primary-foreground"
              >
                <h3 className="text-xl font-heading mb-2">Looking for a QA Enggineer?</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  I'm available for freelance projects and full-time opportunities. Let's discuss how I can help bring your ideas to life.
                </p>
                <Button
                  onClick={handleDownloadCV}
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                  disabled={!about?.resume_url}
                >
                  Download CV
                </Button>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
