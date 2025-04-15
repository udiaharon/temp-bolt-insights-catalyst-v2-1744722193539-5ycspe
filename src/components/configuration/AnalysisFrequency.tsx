
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";

interface AnalysisFrequencyProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const AnalysisFrequency = ({ form }: AnalysisFrequencyProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-gray-700" />
          Analysis Frequency
        </h2>
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 ml-0 sm:ml-8 pt-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="text-gray-700">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <Label htmlFor="weekdays" className="text-gray-700">Weekdays only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="text-gray-700">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bi-weekly" id="bi-weekly" />
                    <Label htmlFor="bi-weekly" className="text-gray-700">Bi-weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="text-gray-700">Monthly</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4 space-y-4 ml-0 sm:ml-8">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-700">Analysis Time</Label>
              <FormControl>
                <Input type="time" {...field} className="h-9 w-full sm:w-[82%] bg-gray-100" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
