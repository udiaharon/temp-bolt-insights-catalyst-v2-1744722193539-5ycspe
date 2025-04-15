
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchLatestTrends } from "@/utils/perplexity/trendAnalysis";
import { parseCategoryInfo } from "@/utils/perplexity/trends/categoryParser";

export function useTrendCategories(brand: string, onRefreshSuccess?: (newTrends: string[]) => void) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [editableRelatedCategories, setEditableRelatedCategories] = useState("");
  const { toast } = useToast();

  const toggleEditMode = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  const initializeCategories = useCallback((firstTrend: string) => {
    const categoryInfo = parseCategoryInfo(firstTrend);
    setPrimaryCategory(categoryInfo.primary);
    setRelatedCategories(categoryInfo.related);
    setEditableRelatedCategories(categoryInfo.related.join(", "));
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!brand || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (!primaryCategory.trim()) {
        toast({
          title: "Invalid input",
          description: "Primary category cannot be empty",
          variant: "destructive",
        });
        setIsRefreshing(false);
        return;
      }
      
      const relatedCategoriesArray = editableRelatedCategories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);
      
      console.log("Refreshing with categories:", {
        primary: primaryCategory,
        related: relatedCategoriesArray
      });
      
      const newTrends = await fetchLatestTrends(brand, {
        primary: primaryCategory,
        related: relatedCategoriesArray
      });
      
      console.log("Received new trends:", newTrends);
      
      if (newTrends && newTrends.length > 0) {
        const newCategoryInfo = parseCategoryInfo(newTrends[0]);
        console.log("Parsed new category info:", newCategoryInfo);
        setPrimaryCategory(newCategoryInfo.primary);
        setRelatedCategories(newCategoryInfo.related);
        setEditableRelatedCategories(newCategoryInfo.related.join(", "));
        
        if (onRefreshSuccess) {
          onRefreshSuccess(newTrends);
        }
        
        toast({
          title: "Categories updated",
          description: "Trends have been refreshed with your custom categories",
        });
      } else {
        toast({
          title: "No trends found",
          description: "Couldn't find trends for the specified categories",
          variant: "destructive",
        });
      }
      
      setEditMode(false);
    } catch (error) {
      console.error('Error refreshing trends:', error);
      toast({
        title: "Error",
        description: "Failed to refresh trends. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [brand, primaryCategory, editableRelatedCategories, onRefreshSuccess, isRefreshing, toast]);

  return {
    isRefreshing,
    editMode,
    primaryCategory, 
    setPrimaryCategory,
    relatedCategories,
    editableRelatedCategories, 
    setEditableRelatedCategories,
    toggleEditMode,
    initializeCategories,
    handleRefresh
  };
}
