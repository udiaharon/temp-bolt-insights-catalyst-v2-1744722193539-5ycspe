
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ConfigurationForm } from "@/types/configuration";
import { AnalysisFrequency } from "@/components/configuration/AnalysisFrequency";
import { NotificationSettings } from "@/components/configuration/NotificationSettings";
import { AnalysisTopicSelection } from "@/components/configuration/AnalysisTopicSelection";
import { SuccessDialog } from "@/components/configuration/SuccessDialog";
import { useState } from "react";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { Card } from "@/components/ui/card";
import { ConfigurationHeader } from "@/components/configuration/ConfigurationHeader";
import { ConfigurationActions } from "@/components/configuration/ConfigurationActions";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Configuration = () => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<ConfigurationForm>({
    defaultValues: {
      frequency: undefined,
      time: "09:00",
      notifications: {
        email: false,
        sms: false,
      },
      emailAddress: "",
      secondaryEmailAddress: "",
      tertiaryEmailAddress: "",
      quaternaryEmailAddress: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      tertiaryPhoneNumber: "",
      quaternaryPhoneNumber: "",
      topics: {
        consumer: false,
        cost: false,
        convenience: false,
        communication: false,
        competitive: false,
        media: false,
      },
    },
  });

  const onSubmit = (data: ConfigurationForm) => {
    console.log("Form submitted:", data);
    setShowSuccessDialog(true);
    toast({
      title: "Configuration saved",
      description: "Your AI agent configuration has been updated successfully.",
    });
  };

  const handleHomeClick = () => {
    // Clear stored analysis data to ensure we get the initial form view
    localStorage.removeItem('analysisData');
    // Navigate to home without passing any state
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <ScrollArea className="h-screen w-screen">
        <div className="w-full min-h-screen px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <ConfigurationHeader />
              <Button
                variant="ghost"
                size="lg"
                onClick={handleHomeClick}
                className="rounded-full bg-blue-200 hover:bg-blue-300 dark:bg-blue-800/40 dark:hover:bg-blue-800/60 p-3"
              >
                <Home className="h-6 w-6 text-blue-900 dark:text-blue-200" />
              </Button>
            </div>

            <div style={{ display: 'none' }}><ApiKeyForm /></div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card className="p-4 bg-[#F1F1F1] [html[data-theme=theme2]_&]:bg-white">
                  <AnalysisTopicSelection form={form} />
                </Card>
                
                <Card className="p-4 bg-[#F1F1F1] [html[data-theme=theme2]_&]:bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 md:border-r border-gray-200 dark:border-gray-700 md:mr-4">
                      <AnalysisFrequency form={form} />
                    </div>

                    <div className="md:col-span-9">
                      <NotificationSettings form={form} />
                    </div>
                  </div>
                </Card>

                <ConfigurationActions onSubmit={form.handleSubmit(onSubmit)} />
              </form>
            </Form>
          </div>
        </div>
      </ScrollArea>

      <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
};

export default Configuration;
