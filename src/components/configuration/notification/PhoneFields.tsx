
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PhoneFieldsProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const PhoneFields = ({ form }: PhoneFieldsProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone Number 1</FormLabel>
              <FormControl>
                <Input type="tel" {...field} className="w-full text-gray-700" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone Number 2</FormLabel>
              <FormControl>
                <Input type="tel" {...field} className="w-full text-gray-700" />
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
          onClick={() => console.log("Add phone clicked")}
        >
          <Plus className="mr-2 h-4 w-4 text-gray-700" />
          Add Phone
        </Button>
      </div>
    </div>
  );
};
