import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="text-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full"
      />
      <p className="mt-4">Gathering detailed insights...</p>
    </div>
  );
};