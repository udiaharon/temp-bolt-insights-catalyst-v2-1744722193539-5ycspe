
import { fetchSearchData, generateTrendDates } from "@/api/searchVolumeApi";

interface ChartData {
  date: string;
  [key: string]: string | number;
}

export const prepareChartData = async (brand: string, competitors: string[], selectedRange: string) => {
  const trendDates = generateTrendDates(parseInt(selectedRange));
  const allBrands = [brand, ...competitors].filter(b => b && b.trim() !== '');
  
  // Fetch all search volumes
  const monthlyData = await Promise.all(
    allBrands.map(brandName => fetchSearchData(brandName))
  );

  // Get only the last N months based on selected range
  const rangeNumber = parseInt(selectedRange);
  const slicedMonthlyData = monthlyData.map(data => 
    data.slice(-rangeNumber)
  );

  // Create final data points with the correct range
  return trendDates.map((datePoint, monthIndex) => {
    const point = { ...datePoint };
    allBrands.forEach((brandName, brandIndex) => {
      point[brandName] = slicedMonthlyData[brandIndex][monthIndex];
    });
    return point;
  });
};
