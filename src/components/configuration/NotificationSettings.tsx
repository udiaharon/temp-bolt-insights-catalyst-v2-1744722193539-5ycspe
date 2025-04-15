
import { Bell, Mail, MessageSquare } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";
import { NotificationToggles } from "./notification/NotificationToggles";
import { EmailFields } from "./notification/EmailFields";
import { PhoneFields } from "./notification/PhoneFields";
import { Separator } from "@/components/ui/separator";

interface NotificationSettingsProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const NotificationSettings = ({ form }: NotificationSettingsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
        <Bell className="h-5 w-5 text-gray-700" />
        Notifications
      </h2>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[45%] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-gray-700" />
                Email Notifications
              </h3>
              <div className="w-[48%]">
                <NotificationToggles form={form} />
              </div>
            </div>
            <EmailFields form={form} />
          </div>
          <Separator orientation="vertical" className="hidden md:block mx-6" />
          <Separator orientation="horizontal" className="block md:hidden" />
          <div className="w-full md:w-[45%] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <MessageSquare className="h-4 w-4 text-gray-700" />
                SMS Notifications
              </h3>
              <div className="w-[48%]">
                <NotificationToggles form={form} />
              </div>
            </div>
            <PhoneFields form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};
