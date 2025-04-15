
import React from 'react';
import { BoldText } from './BoldText';

interface TextSectionProps {
  content: string;
  sectionIndex: number;
}

export const TextSection: React.FC<TextSectionProps> = ({ content, sectionIndex }) => {
  return (
    <div className="space-y-2">
      {content.split('\n').map((line, lineIndex) => {
        if (!line.trim()) return null;

        return (
          <div 
            key={`line-${sectionIndex}-${lineIndex}`}
            className={`leading-relaxed text-sm ${
              line.trim().startsWith('-') || line.trim().startsWith('•') ? 'ml-3' : ''
            }`}
          >
            <BoldText text={line.replace(/^[-•]\s*/, '')} />
          </div>
        );
      })}
    </div>
  );
};
