
import { LanguageSelector } from "@/components/language/LanguageSelector";

interface HeaderControlsProps {
  showLanguageSelector: boolean;
}

export const HeaderControls = ({ showLanguageSelector }: HeaderControlsProps) => {
  if (!showLanguageSelector) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 mr-4">
      <LanguageSelector />
    </div>
  );
};
