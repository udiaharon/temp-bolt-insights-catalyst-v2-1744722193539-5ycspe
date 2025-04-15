
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmailFieldsProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const EmailFields = ({ form }: EmailFieldsProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email Address 1</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="w-full text-gray-700" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryEmailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email Address 2</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="w-full text-gray-700" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-17">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-[#F1F1F1] hover:bg-[#F1F1F1] hover:opacity-90 text-gray-700"
          onClick={() => console.log("Add email clicked")}
        >
          <Plus className="mr-2 h-4 w-4 text-gray-700" />
          Add Email
        </Button>
      </div>
    </div>
  );
};
