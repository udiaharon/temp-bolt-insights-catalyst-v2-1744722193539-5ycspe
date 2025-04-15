
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { makePerplexityRequest } from "@/utils/perplexityApi";
import { Message, ChatBoxProps } from "@/types/chat";
import { MessageBubble } from "./chat/MessageBubble";
import { LoadingIndicator } from "./chat/LoadingIndicator";

export const ChatBox = ({ brand, insights }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatInsightsContext = () => {
    return insights.map(category => 
      `${category.title}:\n${category.topics.map(topic => 
        `- ${topic.headline}\n${topic.insights.join('\n')}`
      ).join('\n')}`
    ).join('\n\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = formatInsightsContext();
      const response = await makePerplexityRequest([
        {
          role: 'system',
          content: `You are a helpful assistant analyzing data about ${brand}. Format your responses with clear structure:
          - Use bullet points (•) for lists
          - Start each new topic with a new line
          - Use paragraphs for detailed explanations
          - Highlight important points with **bold text**
          
          Use this context to answer questions:\n${context}`
        },
        {
          role: 'user',
          content: userMessage
        }
      ]);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-[#3E66FB]/50 border rounded-lg p-4 space-y-4 bg-white/95">
      <h3 className="text-lg font-semibold text-gray-900">Ask about the insights</h3>
      
      <ScrollArea className={`${messages.length > 0 ? 'h-[300px] sm:h-[400px]' : 'h-[0px]'} pr-4 transition-all duration-300`}>
        <div className="space-y-4 text-sm sm:text-base">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the insights..."
          disabled={isLoading}
          className="flex-1 w-full text-sm sm:text-base text-gray-900 bg-white ring-[#3E66FB]/50 focus-visible:ring-[#3E66FB]/50"
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full sm:w-auto [html[data-theme=default]_&]:bg-[#1E2C4F] [html[data-theme=default]_&]:hover:bg-[#1E2C4F]/90 [html[data-theme=theme2]_&]:bg-[#3E66FB] [html[data-theme=theme2]_&]:hover:bg-[#3E66FB]/90 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
