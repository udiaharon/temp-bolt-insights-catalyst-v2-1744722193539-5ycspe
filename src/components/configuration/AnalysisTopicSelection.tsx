
import { UseFormReturn } from "react-hook-form";
import { ConfigurationForm } from "@/types/configuration";
import { 
  Users, 
  DollarSign, 
  MapPin, 
  MessageSquare,
  Target,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ReportPreview } from "../report/ReportPreview";
import { TopicList } from "./TopicList";
import { TopicSelectionHeader } from "./TopicSelectionHeader";
import { useTopicSelection } from "@/hooks/use-topic-selection";

interface AnalysisTopicSelectionProps {
  form: UseFormReturn<ConfigurationForm>;
}

export const AnalysisTopicSelection = ({ form }: AnalysisTopicSelectionProps) => {
  const [showReportExample, setShowReportExample] = useState(false);
  
  const topics = [
    {
      name: "consumer" as const,
      icon: Users,
      label: "Consumer",
      color: "text-blue-500",
      subTopics: [
        "Target Demographics",
        "Consumer Behavior",
        "Market Positioning"
      ]
    },
    {
      name: "cost" as const,
      icon: DollarSign,
      label: "Cost",
      color: "text-green-500",
      subTopics: [
        "Pricing Strategy",
        "Cost Structure",
        "Financial Performance"
      ]
    },
    {
      name: "convenience" as const,
      icon: MapPin,
      label: "Convenience",
      color: "text-purple-500",
      subTopics: [
        "Accessibility",
        "User Experience",
        "Innovation"
      ]
    },
    {
      name: "communication" as const,
      icon: MessageSquare,
      label: "Communication",
      color: "text-orange-500",
      subTopics: [
        "Brand Messaging",
        "Marketing Channels",
        "Social Media Presence"
      ]
    },
    {
      name: "competitive" as const,
      icon: Target,
      label: "Competitive",
      color: "text-red-500",
      subTopics: [
        "Market Position",
        "Growth Strategy",
        "SWOT Analysis"
      ]
    },
    {
      name: "media" as const,
      icon: Video,
      label: "Media",
      color: "text-indigo-500",
      subTopics: [
        "Media Spend",
        "PR & News Coverage",
        "Digital Footprint"
      ]
    }
  ];

  const {
    selectedSubTopics,
    handleSubTopicClick,
    areAllSelected,
    handleSelectAll,
  } = useTopicSelection(topics);

  return (
    <>
      <div className="space-y-4">
        <TopicSelectionHeader
          areAllSelected={areAllSelected}
          onSelectAll={handleSelectAll}
        />
        
        <TopicList
          topics={topics}
          selectedSubTopics={selectedSubTopics}
          onSubTopicClick={handleSubTopicClick}
        />
      </div>

      <Dialog open={showReportExample} onOpenChange={setShowReportExample}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
          </DialogHeader>
          <ReportPreview />
        </DialogContent>
      </Dialog>
    </>
  );
};
