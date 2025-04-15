
export const formatBrandNames = (text: string) => {
  const brandSet = new Set<string>();
  
  // Get analysis data from localStorage
  const storedData = localStorage.getItem('analysisData');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData.brand) {
        brandSet.add(parsedData.brand);
      }
      if (Array.isArray(parsedData.competitors)) {
        parsedData.competitors.forEach((competitor: string) => brandSet.add(competitor));
      }
    } catch (e) {
      console.error('Error parsing analysis data:', e);
    }
  }

  const brandArray = Array.from(brandSet).sort((a, b) => b.length - a.length);
  
  let formattedText = text;
  
  brandArray.forEach(brand => {
    if (brand && brand.trim()) {
      const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Updated regex to include the 's within the bold markers
      const regex = new RegExp(`(?<!\\*|\\w)(${escapedBrand}(?:'s)?)(?!\\*)(?=\\s|[.,;!?]|$)`, 'gi');
      formattedText = formattedText.replace(regex, '**$1**');
    }
  });

  return formattedText;
};
