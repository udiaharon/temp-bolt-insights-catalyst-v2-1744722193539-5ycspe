import { useState, useCallback } from "react";
import { ConfigurationForm } from "@/types/configuration";

interface Topic {
  name: keyof ConfigurationForm['topics'];
  subTopics: string[];
}

export const useTopicSelection = (topics: Topic[]) => {
  const [selectedSubTopics, setSelectedSubTopics] = useState<Record<string, boolean>>({});

  const handleSubTopicClick = useCallback((topicName: string, index: number) => {
    const key = `${topicName}-${index}`;
    setSelectedSubTopics(prev => {
      const newState = { ...prev };
      newState[key] = !prev[key];
      return newState;
    });
  }, []);

  const areAllSelected = topics.every(topic => 
    topic.subTopics.every((_, index) => 
      selectedSubTopics[`${topic.name}-${index}`]
    )
  );

  const handleSelectAll = () => {
    const newState = { ...selectedSubTopics };
    topics.forEach(topic => {
      topic.subTopics.forEach((_, index) => {
        const key = `${topic.name}-${index}`;
        newState[key] = !areAllSelected;
      });
    });
    setSelectedSubTopics(newState);
  };

  return {
    selectedSubTopics,
    handleSubTopicClick,
    areAllSelected,
    handleSelectAll,
  };
};