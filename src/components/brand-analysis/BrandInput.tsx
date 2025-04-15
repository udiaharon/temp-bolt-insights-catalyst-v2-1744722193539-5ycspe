
import { Input } from "@/components/ui/input";

interface BrandInputProps {
  brand: string;
  setBrand: (brand: string) => void;
}

export const BrandInput = ({ brand, setBrand }: BrandInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium dark:text-blue-300 text-blue-300">
        <span data-theme="default" className="block">Brand Name</span>
        <span data-theme="theme2" className="block text-[#3E66FB] font-semibold">Brand Name</span>
      </label>
      <Input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Enter brand name"
        required
        className="transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 data-[theme='theme2']:focus:ring-[#3E66FB] text-black dark:text-white"
      />
    </div>
  );
};
