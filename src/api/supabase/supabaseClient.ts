
import { supabase } from "@/integrations/supabase/client";

export const supabaseClient = {
  functions: {
    /**
     * Invoke a Supabase Edge Function
     */
    invoke: async <T>(functionName: string, payload: any): Promise<{ data: T | null; error: Error | null }> => {
      try {
        console.log(`Invoking Supabase function: ${functionName}`, payload);
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: payload
        });
        
        if (error) {
          console.error(`Error invoking ${functionName}:`, error);
          return { data: null, error };
        }
        
        console.log(`Successfully received response from ${functionName}:`, data);
        return { data, error: null };
      } catch (error) {
        console.error(`Exception invoking ${functionName}:`, error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error(`Unknown error invoking ${functionName}`) 
        };
      }
    }
  }
};
