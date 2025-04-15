import { LucideIcon } from "lucide-react";
import { TopicSection } from "./TopicSection";
import { ConfigurationForm } from "@/types/configuration";
import { UseFormReturn } from "react-hook-form";

interface TopicListProps {
  topics: {
    name: keyof ConfigurationForm['topics'];
    icon: LucideIcon;
    label: string;
    color: string;
    subTopics: string[];
  }[];
  selectedSubTopics: Record<string, boolean>;
  onSubTopicClick: (topicName: string, index: number) => void;
}

export const TopicList = ({
  topics,
  selectedSubTopics,
  onSubTopicClick,
}: TopicListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <TopicSection
          key={topic.name}
          name={topic.name}
          Icon={topic.icon}
          label={topic.label}
          color={topic.color}
          subTopics={topic.subTopics}
          selectedSubTopics={selectedSubTopics}
          onSubTopicClick={onSubTopicClick}
        />
      ))}
    </div>
  );
};