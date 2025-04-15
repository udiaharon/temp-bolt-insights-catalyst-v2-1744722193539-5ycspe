
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const GoogleApiKeyVerifier = () => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyApiKey = async () => {
    setIsVerifying(true);
    
    try {
      // Call the Supabase function to get the test search results with a test brand name
      const { data, error } = await supabase.functions.invoke('fetch-logo', {
        body: { query: 'google', brand: 'google' }
      });

      if (error) {
        console.error('Verification error:', error);
        throw new Error(error.message);
      }

      // Check if we received a valid response with an image URL
      if (data?.url) {
        toast({
          title: "Success",
          description: "Your Google CSE API key is valid and working correctly!",
          duration: 3000,
        });
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Could not verify the API key. Please check your API key and try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        onClick={verifyApiKey}
        disabled={isVerifying}
        variant="outline"
        className="w-full"
      >
        {isVerifying ? "Verifying..." : "Verify Google CSE API Key"}
      </Button>
    </div>
  );
};
