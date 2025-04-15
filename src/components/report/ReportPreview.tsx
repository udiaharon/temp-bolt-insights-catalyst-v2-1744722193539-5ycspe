
import { Users, DollarSign, MapPin, MessageSquare, Target, Video, Package, TrendingUp, Cpu, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCitationNavigation } from "@/utils/presentation/utils/citations/slideCitationUtils";

export const ReportPreview = () => {
  const { handleCitationClick } = useCitationNavigation();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sections = [
    {
      title: "Consumer Analysis",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      metrics: [
        "Overall sentiment: Positive",
        "Customer satisfaction rate: 87%",
        "Key demographics: 25-34 age group"
      ]
    },
    {
      title: "Cost Analysis",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
      metrics: [
        "Market positioning: Premium segment",
        "Price competitiveness: Above average",
        "Value perception: Strong"
      ]
    },
    {
      title: "Convenience Metrics",
      icon: MapPin,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      metrics: [
        "Accessibility score: 8.5/10",
        "Distribution efficiency: 92%",
        "Location optimization: High"
      ]
    },
    {
      title: "Communication Assessment",
      icon: MessageSquare,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      metrics: [
        "Message clarity: High",
        "Brand voice consistency: 95%",
        "Engagement rate: Strong"
      ]
    },
    {
      title: "Competitive Analysis",
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-50",
      metrics: [
        "Market share: 23%",
        "Growth rate: +15% YoY",
        "Competitive advantage: Strong"
      ]
    },
    {
      title: "Media Performance",
      icon: Video,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      metrics: [
        "Social media engagement: 250K monthly",
        "Media presence score: 8.9/10",
        "Content effectiveness: High"
      ]
    },
    {
      title: "Product Analysis",
      icon: Package,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      metrics: [
        "Product innovation score: 92/100",
        "Feature satisfaction rate: 88%",
        "Market fit index: High"
      ]
    },
    {
      title: "Industry Trends",
      icon: TrendingUp,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      metrics: [
        "Market growth rate: 15%",
        "Regulatory compliance: Strong",
        "Sector position: Market leader"
      ]
    },
    {
      title: "Technology Adoption",
      icon: Cpu,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      metrics: [
        "Digital transformation score: 85/100",
        "Tech stack efficiency: High",
        "Innovation index: 9.2/10"
      ]
    }
  ];

  // Format text to handle brand names with possessive 's
  const formatMetric = (text: string) => {
    // Get brand names from localStorage
    const storedBrand = localStorage.getItem('currentBrand');
    const storedCompetitors = localStorage.getItem('currentCompetitors');
    const brandSet = new Set<string>();
    
    if (storedBrand) {
      brandSet.add(storedBrand);
    }
    
    if (storedCompetitors) {
      try {
        const competitors = JSON.parse(storedCompetitors);
        competitors.forEach((competitor: string) => brandSet.add(competitor));
      } catch (e) {
        console.error('Error parsing competitors:', e);
      }
    }

    // Check for citation pattern [n] and make it clickable
    const citationPattern = /\[(\d+)\]/g;
    if (citationPattern.test(text)) {
      const parts = text.split(citationPattern);
      return parts.map((part, index) => {
        // Even indices are regular text, odd ones are citation numbers
        if (index % 2 === 0) {
          // Process the regular text part for brand names
          const words = part.split(' ');
          return words.map((word, wordIndex) => {
            // Handle brand names with formatting
            const baseWord = word.replace(/'s(\W*)$/, '');
            const hasApostropheS = word.match(/'s(\W*)$/);
            const punctuation = word.match(/[.,!?;:]$/)?.[0] || '';
            
            const cleanBaseWord = baseWord.replace(/[.,!?;:]$/, '');

            if (brandSet.has(cleanBaseWord)) {
              return (
                <span key={`${index}-${wordIndex}`} className="font-semibold">
                  {cleanBaseWord}{hasApostropheS ? "'s" : ''}{punctuation}{' '}
                </span>
              );
            }
            return <span key={`${index}-${wordIndex}`}>{word} </span>;
          });
        } else {
          // This is a citation number
          const citationUrl = `https://example.com/citation/${part}`;
          return (
            <a
              key={`citation-${index}`}
              href="#"
              onClick={(e) => handleCitationClick(e, citationUrl)}
              className="inline-flex items-center text-blue-600 hover:underline"
              data-citation-link="true"
            >
              [{part}]
            </a>
          );
        }
      });
    }

    // If no citations, just handle brand names
    const words = text.split(' ');
    return words.map((word, index) => {
      // Check for possessive form by removing 's if present
      const baseWord = word.replace(/'s(\W*)$/, '');
      const hasApostropheS = word.match(/'s(\W*)$/);
      const punctuation = word.match(/[.,!?;:]$/)?.[0] || '';
      
      // Remove punctuation for checking
      const cleanBaseWord = baseWord.replace(/[.,!?;:]$/, '');

      if (brandSet.has(cleanBaseWord)) {
        return (
          <span key={index}>
            <strong className="font-semibold">
              {cleanBaseWord}{hasApostropheS ? "'s" : ''}{punctuation}
            </strong>
            {' '}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  return (
    <ScrollArea className="h-[80vh]">
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-black">
              Automated Brand Analysis Report
            </h1>
            <div className="text-gray-500 text-sm">
              <p>Generated on: {currentDate}</p>
              <p>Brand: Example Brand</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-lg font-semibold text-gray-800">Executive Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${section.bgColor} border border-${section.color}/20`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${section.color}`} />
                      <h3 className="text-base font-semibold text-gray-800">
                        {section.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${section.color} hover:bg-transparent hover:opacity-80`}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="sr-only">Expand {section.title}</span>
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {section.metrics.map((metric, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">
                        • {formatMetric(metric)}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
};
