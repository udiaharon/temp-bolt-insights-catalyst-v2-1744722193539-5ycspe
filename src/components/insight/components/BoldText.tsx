
import React from 'react';

interface BoldTextProps {
  text: string;
}

export const BoldText: React.FC<BoldTextProps> = ({ text }) => {
  // Ensure we have valid text to process
  if (!text) return null;
  
  // Pattern to find text between ** markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Extract text between ** markers and make it bold
          const boldText = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold">
              {boldText}
            </strong>
          );
        }
        // Return regular text without bold formatting
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
