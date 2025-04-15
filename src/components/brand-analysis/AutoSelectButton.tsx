import { Button } from "@/components/ui/button";
import { List, LoaderCircle } from "lucide-react";

interface AutoSelectButtonProps {
  isAutoSelecting: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const AutoSelectButton = ({ isAutoSelecting, onClick, disabled }: AutoSelectButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className="w-full mt-2 gap-2"
      disabled={disabled}
    >
      {isAutoSelecting ? (
        <div className="flex items-center justify-center">
          <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
          Selecting competitors...
        </div>
      ) : (
        <>
          <List className="w-4 h-4" />
          Auto competitors selection
        </>
      )}
    </Button>
  );
};