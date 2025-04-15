
import { Building, ChartBar, Users, Home, Map, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AnalysisHeaderProps {
  brand: string;
  competitors: string[];
  onReset: () => void;
}

const capitalizeString = (str: string): string => {
  if (!str) return str;
  return str.toUpperCase();
};

export const AnalysisHeader = ({ brand, competitors, onReset }: AnalysisHeaderProps) => {
  const theme = document.documentElement.getAttribute('data-theme');
  const [category, setCategory] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  
  useEffect(() => {
    // Get category and country from localStorage if they exist
    const storedCategory = localStorage.getItem('category');
    const storedCountry = localStorage.getItem('country');
    
    if (storedCategory) setCategory(storedCategory);
    if (storedCountry) setCountry(storedCountry);
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-2"
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-3">
          <span data-theme="default">
            <Button
              variant="secondary"
              size="default"
              onClick={onReset}
              className="w-10 h-10 flex-shrink-0 text-white transition-all duration-200 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400"
            >
              <Home className="w-5 h-5" />
            </Button>
          </span>
          <span data-theme="theme2" className="hidden">
            <Button
              variant="secondary"
              size="default"
              onClick={onReset}
              className="w-10 h-10 flex-shrink-0 text-white transition-all duration-200 !bg-[#3E66FB] hover:!bg-[#3E66FB]/90"
            >
              <Home className="w-5 h-5" />
            </Button>
          </span>

          <h2 className="text-xl font-semibold">
            <span data-theme="default" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Analysis Results
            </span>
            <span data-theme="theme2" className="text-primary hidden">
              Analysis Results
            </span>
          </h2>
        </div>

        <div className="flex flex-col ml-13 space-y-2">
          <div className="flex items-center gap-1.5">
            <span data-theme="default">
              <Building className="w-4 h-4 text-purple-500" />
            </span>
            <span data-theme="theme2" className="hidden">
              <Building className="w-4 h-4 text-primary" />
            </span>
            <p className="text-base">
              <span data-theme="default" className="text-gray-300">
                Brand: <span className="font-semibold text-blue-300">{capitalizeString(brand)}</span>
              </span>
              <span data-theme="theme2" className="text-primary/60 hidden">
                Brand: <span className="font-semibold text-primary">{capitalizeString(brand)}</span>
              </span>
            </p>
          </div>
          
          {category && (
            <div className="flex items-center gap-1.5">
              <span data-theme="default">
                <Tag className="w-4 h-4 text-purple-500" />
              </span>
              <span data-theme="theme2" className="hidden">
                <Tag className="w-4 h-4 text-primary" />
              </span>
              <p className="text-base">
                <span data-theme="default" className="text-gray-300">
                  Category: <span className="font-semibold text-blue-300">{capitalizeString(category)}</span>
                </span>
                <span data-theme="theme2" className="text-primary/60 hidden">
                  Category: <span className="font-semibold text-primary">{capitalizeString(category)}</span>
                </span>
              </p>
            </div>
          )}
          
          {country && (
            <div className="flex items-center gap-1.5">
              <span data-theme="default">
                <Map className="w-4 h-4 text-purple-500" />
              </span>
              <span data-theme="theme2" className="hidden">
                <Map className="w-4 h-4 text-primary" />
              </span>
              <p className="text-base">
                <span data-theme="default" className="text-gray-300">
                  Country: <span className="font-semibold text-blue-300">{capitalizeString(country)}</span>
                </span>
                <span data-theme="theme2" className="text-primary/60 hidden">
                  Country: <span className="font-semibold text-primary">{capitalizeString(country)}</span>
                </span>
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            <span data-theme="default">
              <Users className="w-4 h-4 text-purple-500" />
            </span>
            <span data-theme="theme2" className="hidden">
              <Users className="w-4 h-4 text-gray-800" />
            </span>
            <p className="text-base">
              <span data-theme="default" className="text-gray-300">
                Competitors: 
                {competitors.length > 0 ? (
                  <span className="ml-1">
                    {competitors.map((competitor, index) => (
                      <span key={index} className="font-semibold text-blue-300">
                        {capitalizeString(competitor)}
                        {index < competitors.length - 1 && (
                          <span className="text-blue-300/50 mx-1">•</span>
                        )}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-gray-400 italic ml-1">
                    No competitors specified
                  </span>
                )}
              </span>
              <span data-theme="theme2" className="text-gray-800 hidden">
                Competitors: 
                {competitors.length > 0 ? (
                  <span className="ml-1">
                    {competitors.map((competitor, index) => (
                      <span key={index} className="font-semibold text-gray-800">
                        {capitalizeString(competitor)}
                        {index < competitors.length - 1 && (
                          <span className="text-gray-500 mx-1">•</span>
                        )}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-gray-500 italic ml-1">
                    No competitors specified
                  </span>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
