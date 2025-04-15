
import { Message } from "@/types/chat";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MessageBubbleProps {
  message: Message;
}

const formatText = (text: string) => {
  // Split text into paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    // Check if paragraph starts with a bullet point
    const isBulletPoint = paragraph.trim().startsWith('•') || 
                         paragraph.trim().startsWith('-') || 
                         paragraph.trim().startsWith('*');

    // Format bullet points with proper spacing
    if (isBulletPoint) {
      return (
        <div key={index} className="ml-4 my-1">
          {paragraph.split(/(\*\*.*?\*\*)/).map((part, pIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIndex} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    }

    // Regular paragraph formatting
    return (
      <p key={index} className="mb-2">
        {paragraph.split(/(\*\*.*?\*\*)/).map((part, pIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIndex} className="font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy message",
      });
    }
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[95%] sm:max-w-[90%] rounded-lg p-3 group text-sm sm:text-base ${
          message.role === 'user'
            ? '[html[data-theme=default]_&]:bg-[#1E2C4F] [html[data-theme=theme2]_&]:bg-[#3E66FB] text-white'
            : '[html[data-theme=default]_&]:bg-[#E2E8F9] [html[data-theme=default]_&]:text-[#1E2C4F] [html[data-theme=theme2]_&]:bg-[#EEF2FF] [html[data-theme=theme2]_&]:text-black dark:bg-[#3E66FB]/10 dark:text-white'
        }`}
      >
        <div className="space-y-1">
          {formatText(message.content)}
        </div>
        <button
          onClick={handleCopy}
          className="absolute bottom-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/10 rounded"
          title="Copy message"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
