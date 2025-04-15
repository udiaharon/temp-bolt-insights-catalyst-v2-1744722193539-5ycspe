
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef } from "react";

interface TopicSubSectionProps {
  topicName: string;
  subTopics: string[];
  color: string;
  selectedSubTopics: Record<string, boolean>;
  onSubTopicClick: (topicName: string, index: number) => void;
}

const CustomCheckbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-3 w-3 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center" />
  </CheckboxPrimitive.Root>
));
CustomCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export const TopicSubSection = ({
  topicName,
  subTopics,
  color,
  selectedSubTopics,
  onSubTopicClick,
}: TopicSubSectionProps) => {
  return (
    <div className="pl-8 space-y-2">
      {subTopics.map((subTopic, index) => (
        <div
          key={`${topicName}-${index}`}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <CustomCheckbox
            id={`${topicName}-${index}`}
            checked={selectedSubTopics[`${topicName}-${index}`] || false}
            onCheckedChange={() => onSubTopicClick(topicName, index)}
          />
          <span className={`text-sm text-gray-700 ${color}`}>{subTopic}</span>
        </div>
      ))}
    </div>
  );
};
