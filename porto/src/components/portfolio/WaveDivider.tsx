import { motion } from "framer-motion";

interface WaveDividerProps {
  className?: string;
  variant?: "top" | "bottom";
}

export const WaveDivider = ({ className = "", variant = "bottom" }: WaveDividerProps) => {
  const isTop = variant === "top";
  
  return (
    <div className={`absolute left-0 right-0 overflow-hidden pointer-events-none ${isTop ? "top-0" : "bottom-0"} ${className}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`w-[200%] h-24 md:h-32 ${isTop ? "rotate-180" : ""}`}
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
          className="fill-primary/10"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
          d="M0 80C240 40 480 100 720 80C960 60 1200 100 1440 80V120H0V80Z"
          className="fill-primary/5"
        />
      </motion.svg>
    </div>
  );
};

export default WaveDivider;
