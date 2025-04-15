
export interface BrandAwarenessTrendChartProps {
  brand: string;
  competitors: string[];
}

export interface SearchData {
  date: string;
  [key: string]: number | string;
}
