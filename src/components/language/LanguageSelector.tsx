
import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages, getSelectedLanguage, setSelectedLanguage } from "@/utils/stores/languageStore";

export const LanguageSelector = () => {
  const [language, setLanguage] = useState(() => getSelectedLanguage());

  useEffect(() => {
    // Update localStorage when language changes
    setSelectedLanguage(language);
  }, [language]);

  return (
    <div className="flex items-center gap-2">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-10 h-10 p-0 justify-center rounded-full border-primary">
          <Globe className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent className="min-w-[200px] max-h-[800px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
