
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingSpinner } from "@/components/insight/LoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartTooltip } from "./ChartTooltip";
import { COMPETITOR_COLORS } from "../constants/chartColors";
import { fetchSearchData, generateTrendDates } from "../utils/searchVolume";
import { BrandAwarenessTrendChartProps, SearchData } from "../types/chartTypes";
import { useToast } from "@/components/ui/use-toast";

export const BrandAwarenessTrendChart = ({ brand, competitors = [] }: BrandAwarenessTrendChartProps) => {
  const [data, setData] = useState<SearchData[]>([]);
  const [filteredData, setFilteredData] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("12");
  const [visibleBrands, setVisibleBrands] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validCompetitors = competitors.filter(comp => comp && comp.trim() !== '');
  
  // Verify we have a valid brand
  useEffect(() => {
    if (!brand || brand.trim() === '') {
      // If no brand is provided through props, try to get from localStorage
      const storedBrand = localStorage.getItem('currentBrand');
      if (!storedBrand || storedBrand.trim() === '') {
        setError('No brand specified. Please enter a brand to analyze.');
        setLoading(false);
        toast({
          title: "Error",
          description: "No brand name provided for analysis.",
          variant: "destructive"
        });
      }
    }
  }, [brand, toast]);

  useEffect(() => {
    const initialVisibility = {
      [brand]: true,
      ...Object.fromEntries(validCompetitors.map(comp => [comp, true]))
    };
    setVisibleBrands(initialVisibility);

    // Store competitors in localStorage for PowerPoint generation
    localStorage.setItem('currentCompetitors', JSON.stringify(validCompetitors));
  }, [brand, competitors]);

  const filterData = (months: string, fullData: SearchData[]) => {
    const monthCount = parseInt(months);
    return fullData.slice(-monthCount);
  };

  useEffect(() => {
    setFilteredData(filterData(dateRange, data));
  }, [dateRange, data]);

  useEffect(() => {
    let isMounted = true;
    
    const generateTrendData = async () => {
      try {
        console.log('Starting trend data generation for:', brand);
        setLoading(true);
        
        // Check if we have a valid brand
        if (!brand || brand.trim() === '') {
          // Try to get from localStorage
          const storedBrand = localStorage.getItem('currentBrand');
          if (!storedBrand || storedBrand.trim() === '') {
            throw new Error('No brand specified');
          }
        }
        
        const trendDates = generateTrendDates(24);
        const allBrands = [brand, ...validCompetitors];
        console.log('Processing brands:', allBrands);

        const monthlyData = await Promise.all(
          allBrands.map(brandName => {
            console.log('Fetching data for brand:', brandName);
            return fetchSearchData(brandName);
          })
        );

        console.log('Monthly data fetched:', monthlyData);

        const finalData = trendDates.map((datePoint, monthIndex) => {
          const point: SearchData = { ...datePoint };
          allBrands.forEach((brandName, brandIndex) => {
            point[brandName] = monthlyData[brandIndex][monthIndex];
          });
          return point;
        });

        if (isMounted) {
          console.log('Setting final data:', finalData);
          setData(finalData);
          setFilteredData(filterData(dateRange, finalData));
          
          // Store the chart data in localStorage for PowerPoint generation
          localStorage.setItem('brandAwarenessData', JSON.stringify(finalData));
          localStorage.setItem('brandAwarenessDateRange', dateRange);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to generate trend data:', error);
        if (isMounted) {
          setLoading(false);
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
          toast({
            title: "Error",
            description: "Failed to generate brand awareness data. Please try again.",
            variant: "destructive"
          });
          
          const emptyData = generateTrendDates(24).map(dataPoint => ({
            ...dataPoint,
            [brand]: 0,
            ...Object.fromEntries(validCompetitors.map(comp => [comp, 0]))
          }));
          setData(emptyData);
          setFilteredData(emptyData);
        }
      }
    };

    if (brand) {
      console.log('Initiating data generation for brand:', brand);
      generateTrendData();
    } else {
      console.log('No brand provided, skipping data generation');
    }

    return () => {
      isMounted = false;
    };
  }, [brand, competitors, dateRange, toast]);

  if (loading) {
    return <LoadingSpinner variant="swot" />;
  }
  
  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <p className="text-gray-600">Please enter a brand name to analyze.</p>
        </div>
      </div>
    );
  }

  const allBrands = [brand, ...validCompetitors];

  return (
    <div className="w-full h-[420px] mt-4 p-4 pb-2 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Brand Search Interest Comparison
        </h3>
        <Select value={dateRange} onValueChange={(value) => {
          setDateRange(value);
          // Store the selected date range for PowerPoint generation
          localStorage.setItem('brandAwarenessDateRange', value);
        }}>
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
            <SelectItem value="24">Last 24 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[70%] mb-4 brand-awareness-chart" data-selected-range={dateRange}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={filteredData}
            margin={{ top: 5, right: 30, left: 30, bottom: 15 }}
          >
            <XAxis 
              dataKey="date" 
              padding={{ left: 30, right: 30 }}
              tick={{ fill: '#1A1F2C' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              hide={true}
            />
            <Tooltip content={<ChartTooltip />} />
            {allBrands.map((brandName, index) => (
              visibleBrands[brandName] && (
                <Line
                  key={brandName}
                  type="monotone"
                  dataKey={brandName}
                  name={brandName}
                  stroke={COMPETITOR_COLORS[index]}
                  strokeWidth={index === 0 ? 3 : 2}
                  dot={{ fill: COMPETITOR_COLORS[index], r: index === 0 ? 4 : 3 }}
                  strokeOpacity={1}
                  fillOpacity={1}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-1">
        {allBrands.map((brandName, index) => (
          <div key={brandName} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brandName}`}
              checked={visibleBrands[brandName]}
              onCheckedChange={(checked) => {
                setVisibleBrands(prev => ({
                  ...prev,
                  [brandName]: checked === true
                }));
              }}
            />
            <label
              htmlFor={`brand-${brandName}`}
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: COMPETITOR_COLORS[index] }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COMPETITOR_COLORS[index] }}></span>
              {brandName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
