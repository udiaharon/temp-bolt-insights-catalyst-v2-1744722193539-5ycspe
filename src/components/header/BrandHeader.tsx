import { motion } from "framer-motion";

interface BrandHeaderProps {
  showSubheader?: boolean;
}

export const BrandHeader = ({ showSubheader = true }: BrandHeaderProps) => {
  return (
    <div className="relative w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center items-center mb-6 gap-2">
          {/* Lightbulb icon has been removed */}
        </div>
      </motion.div>
    </div>
  );
};
