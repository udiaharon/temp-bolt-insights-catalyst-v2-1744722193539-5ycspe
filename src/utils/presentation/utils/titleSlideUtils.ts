
import pptxgen from "pptxgenjs";

export const createTitleSlide = async (
  pptx: pptxgen,
  brand: string,
  brandLogoUrl?: string | null
) => {
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: "F1F5F9" };

  if (brandLogoUrl && brandLogoUrl.startsWith('data:image')) {
    try {
      console.log("Adding logo to title slide:", {
        logoPreview: brandLogoUrl.substring(0, 50) + '...',
        isDataUrl: brandLogoUrl.startsWith('data:'),
      });

      await titleSlide.addImage({
        data: brandLogoUrl,
        x: 4.25,
        y: 1,
        w: 1.5,
        h: 1.5,
        sizing: { type: 'contain', w: 1.5, h: 1.5 }
      });
    } catch (error) {
      console.error("Error adding logo to slide:", error);
    }
  } else {
    console.log("No valid logo URL provided:", {
      hasUrl: !!brandLogoUrl,
      isDataUrl: brandLogoUrl?.startsWith('data:'),
    });
  }

  titleSlide.addText(`${brand.toUpperCase()} Market Analysis`, {
    x: 0.5,
    y: 3,
    w: "90%",
    h: 1.5,
    align: "center",
    fontSize: 44,
    color: "2563EB",
    bold: true,
  });
};
