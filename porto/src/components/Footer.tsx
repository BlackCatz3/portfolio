const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-2 md:py-3 text-center text-[10px] md:text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border-t border-border/50">
      <p>© 2026 Portofolio Zogi. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
