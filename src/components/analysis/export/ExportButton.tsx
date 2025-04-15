
import { Button } from "@/components/ui/button";
import { FileDown, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface ExportButtonProps {
  isExporting: boolean;
  onClick: (e: React.MouseEvent) => Promise<void>;
}

export const ExportButton = ({ isExporting, onClick }: ExportButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1.2
      }}
    >
      <Button
        onClick={onClick}
        variant="outline"
        className="gap-2 w-full sm:w-auto [html[data-theme=default]_&]:bg-white [html[data-theme=default]_&]:text-gray-800 [html[data-theme=theme2]_&]:bg-[#3E66FB] [html[data-theme=theme2]_&]:text-white [html[data-theme=theme2]_&]:border-[#3E66FB] [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/90 [html[data-theme=default]_&]:hover:bg-gray-50"
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Loader className="w-4 h-4 [html[data-theme=default]_&]:text-gray-800 [html[data-theme=theme2]_&]:text-white animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 [html[data-theme=default]_&]:text-gray-800 [html[data-theme=theme2]_&]:text-white" />
            Export to PowerPoint
          </>
        )}
      </Button>
    </motion.div>
  );
};
