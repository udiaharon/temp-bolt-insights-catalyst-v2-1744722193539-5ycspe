
import { brandContentService } from "@/services/brandContentService";

export const fetchBrandLogo = async (brandName: string): Promise<string> => {
  if (!brandName) {
    console.error("No brand name provided for logo fetch");
    throw new Error("Brand name is required for logo fetch");
  }

  try {
    const logoUrl = await brandContentService.fetchBrandLogo(brandName);
    if (!logoUrl) {
      throw new Error("Could not fetch brand logo");
    }
    return logoUrl;
  } catch (error) {
    console.error("Logo fetch error:", error);
    throw error; // Let the caller handle the error
  }
};
