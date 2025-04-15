import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-center">Analysis Complete</h2>
        <p className="text-center text-gray-500">
          Your brand analysis has been generated successfully and is ready to view.
        </p>
        <Button onClick={() => onOpenChange(false)}>
          View Results
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);