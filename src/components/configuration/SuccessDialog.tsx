
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&[data-theme=theme2]_button]:bg-[#3E66FB] [&[data-theme=theme2]_button]:text-white [&[data-theme=theme2]_button]:hover:bg-[#3E66FB]/90">
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-center">Configuration Saved Successfully</h2>
          <p className="text-center text-gray-500">
            Your AI agent configuration has been updated and is ready to use.
          </p>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
