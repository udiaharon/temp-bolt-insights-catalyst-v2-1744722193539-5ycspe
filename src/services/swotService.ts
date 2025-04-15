
import { performSwotAnalysis, SwotAnalysis } from "@/api/swotApi";

export const swotService = {
  async analyzeSwot(brand: string): Promise<SwotAnalysis> {
    try {
      const data = await performSwotAnalysis(brand);
      
      // Store in localStorage for persistence
      this.persistSwotAnalysis(data);
      
      return data;
    } catch (error) {
      console.error('Error performing SWOT analysis:', error);
      throw error;
    }
  },
  
  persistSwotAnalysis(analysis: SwotAnalysis): void {
    localStorage.setItem('swotAnalysis', JSON.stringify(analysis));
  },
  
  getStoredSwotAnalysis(): SwotAnalysis | null {
    try {
      const savedAnalysis = localStorage.getItem('swotAnalysis');
      if (savedAnalysis) {
        return JSON.parse(savedAnalysis);
      }
      return null;
    } catch (error) {
      console.error('Error parsing saved SWOT analysis:', error);
      return null;
    }
  }
};
