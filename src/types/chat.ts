export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatBoxProps {
  brand: string;
  insights: Array<{ 
    title: string; 
    topics: Array<{ 
      headline: string; 
      insights: string[]; 
    }>; 
  }>;
}