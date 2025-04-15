
import { Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";
import { Button } from "@/components/ui/button";

interface NotificationTogglesProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const NotificationToggles = ({ form }: NotificationTogglesProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full bg-[#F1F1F1] text-gray-700"
      onClick={() => console.log("Select contacts clicked")}
    >
      <Users className="mr-2 h-4 w-4 text-gray-700" />
      Select Contacts
    </Button>
  );
};
