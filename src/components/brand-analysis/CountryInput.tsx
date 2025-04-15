
import { Input } from "@/components/ui/input";

interface CountryInputProps {
  country: string;
  setCountry: (country: string) => void;
}

export const CountryInput = ({ country, setCountry }: CountryInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium dark:text-blue-300 text-blue-300">
        <span data-theme="default" className="block">Country (Optional)</span>
        <span data-theme="theme2" className="block text-[#3E66FB] font-semibold">Country (Optional)</span>
      </label>
      <Input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Enter country"
        className="transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 data-[theme='theme2']:focus:ring-[#3E66FB] text-black dark:text-white"
      />
    </div>
  );
};
