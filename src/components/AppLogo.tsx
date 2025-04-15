
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const AppLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-4 z-50"
    >
      <Link to="/" className="block">
        <img
          src="/lovable-uploads/fda4d179-75b5-4612-b2d7-b8002a7f9467.png"
          alt="Brand Insights Engine Logo"
          className="w-12 h-12 sm:w-14 sm:h-14"
        />
      </Link>
    </motion.div>
  );
};
