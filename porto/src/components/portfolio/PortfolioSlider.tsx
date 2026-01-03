import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import Footer from "../Footer";

const sections = ["home", "about", "experience", "projects", "contact"];

export const PortfolioSlider = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setIsDark(false);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const navigateToSection = useCallback((index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        navigateToSection(Math.min(currentSection + 1, sections.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        navigateToSection(Math.max(currentSection - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, navigateToSection]);

  // Touch/swipe support for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          navigateToSection(Math.min(currentSection + 1, sections.length - 1));
        } else {
          navigateToSection(Math.max(currentSection - 1, 0));
        }
      }
    };
    
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, navigateToSection]);

  return (
    <div className="h-[100svh] w-screen overflow-x-hidden overflow-y-hidden bg-background flex flex-col">
      {/* Navigation - Fixed height */}
      <div className="flex-shrink-0 z-50 bg-background h-14 md:h-16">
        <Navigation
          sections={sections}
          currentSection={currentSection}
          onNavigate={navigateToSection}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
      </div>

      {/* Horizontal Slider Container - takes remaining height */}
      <div 
        className="flex-1 overflow-x-hidden overflow-y-hidden"
        style={{ height: 'calc(100svh - 3.5rem)' }}
      >
        <motion.div
          className="flex h-full"
          animate={{ x: `-${currentSection * 100}vw` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <HeroSection onNavigate={navigateToSection} />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection isActive={currentSection === 3} />
          <ContactSection />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PortfolioSlider;
