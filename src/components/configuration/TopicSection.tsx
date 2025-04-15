
import { LucideIcon } from "lucide-react";
import { TopicSubSection } from "./TopicSubSection";

interface TopicSectionProps {
  name: string;
  Icon: LucideIcon;
  label: string;
  color: string;
  subTopics: string[];
  selectedSubTopics: Record<string, boolean>;
  onSubTopicClick: (topicName: string, index: number) => void;
}

export const TopicSection = ({
  name,
  Icon,
  label,
  color,
  subTopics,
  selectedSubTopics,
  onSubTopicClick,
}: TopicSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="flex items-center gap-2 text-gray-700">{label}</span>
      </div>
      <TopicSubSection
        topicName={name}
        subTopics={subTopics}
        color={color}
        selectedSubTopics={selectedSubTopics}
        onSubTopicClick={onSubTopicClick}
      />
    </div>
  );
};
