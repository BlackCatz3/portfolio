import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AdminPlaceholderProps {
  title: string;
  description?: string;
}

export const AdminPlaceholder = ({ title, description }: AdminPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="p-6 rounded-full bg-primary/10 inline-block">
          <Construction className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold">{title}</h1>
          <p className="text-muted-foreground max-w-md">
            {description || "This section is coming soon. Full CMS functionality with database and authentication will be available soon."}
          </p>
        </div>
        <Link to="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminPlaceholder;
