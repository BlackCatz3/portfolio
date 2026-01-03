import { motion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  sections: string[];
  currentSection: number;
  onNavigate: (index: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navigation = ({
  sections,
  currentSection,
  onNavigate,
  isDark,
  onToggleTheme,
}: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (index: number) => {
    onNavigate(index);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block py-4 px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between bg-card/95 backdrop-blur-xl rounded-2xl px-6 py-3 border border-border/50 shadow-lg">
            {/* Logo */}
            <motion.div
              className="text-xl font-heading font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
            >
              Portfolio
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {sections.map((section, index) => (
                <button
                  key={section}
                  onClick={() => handleNavigate(index)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    currentSection === index
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {currentSection === index && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{section}</span>
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="rounded-full"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile & Tablet Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="md:hidden safe-area-inset"
      >
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          <div className="flex items-center justify-between glass rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3 border border-border/50 shadow-lg">
            {/* Logo */}
            <motion.div 
              className="text-base sm:text-lg font-heading font-bold text-gradient"
              whileTap={{ scale: 0.95 }}
            >
              Portfolio
            </motion.div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Current Section Indicator - Tablet */}
              <div className="hidden xs:flex items-center mr-2">
                <span className="text-xs text-muted-foreground capitalize">
                  {sections[currentSection]}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
                </motion.div>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="px-3 sm:px-4 mt-2 overflow-hidden"
        >
          <div className="glass rounded-2xl border border-border/50 p-2 sm:p-3 shadow-lg">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section}
                  onClick={() => handleNavigate(index)}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium transition-all ${
                    currentSection === index
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{section}</span>
                  {currentSection === index && (
                    <motion.div
                      layoutId="activeMobileSection"
                      className="absolute inset-0 bg-primary rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Quick hint */}
            <p className="text-center text-xs text-muted-foreground mt-3 pb-1">
              Swipe or use arrow keys to navigate
            </p>
          </div>
        </motion.div>
      </motion.nav>

      {/* Section Indicators (dots) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            onClick={() => handleNavigate(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? "bg-primary scale-125 shadow-glow"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            title={section}
          />
        ))}
      </div>
    </>
  );
};

export default Navigation;
