
import { Input } from "@/components/ui/input";

interface CategoryInputProps {
  category: string;
  setCategory: (category: string) => void;
}

export const CategoryInput = ({ category, setCategory }: CategoryInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium dark:text-blue-300 text-blue-300">
        <span data-theme="default" className="block">Category (Optional)</span>
        <span data-theme="theme2" className="block text-[#3E66FB] font-semibold">Category (Optional)</span>
      </label>
      <Input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
        className="transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 data-[theme='theme2']:focus:ring-[#3E66FB] text-black dark:text-white"
      />
    </div>
  );
};
