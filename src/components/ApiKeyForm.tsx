
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleApiKeyVerifier } from "./GoogleApiKeyVerifier";

export const ApiKeyForm = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-green-600 dark:text-green-400">✓ Google CSE API Key is managed in Supabase</p>
        </div>
        <GoogleApiKeyVerifier />
      </div>
    </div>
  );
};
