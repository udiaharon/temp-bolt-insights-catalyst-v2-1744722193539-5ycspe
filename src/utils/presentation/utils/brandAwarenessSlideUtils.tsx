
import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrandAwarenessChart } from '../components/BrandAwarenessChart';
import { prepareChartData } from './chartDataUtils';
import { setPreventRerenderFlags } from './citations/preventRerenderUtils';

export const createBrandAwarenessSlide = async (
  pptx: pptxgen,
  brand: string
) => {
  // Set prevention flags immediately when creating a slide
  setPreventRerenderFlags();
  
  const awarenessSlide = pptx.addSlide();
  awarenessSlide.background = { color: "F1F5F9" };

  // Add the title
  awarenessSlide.addText("Brand Awareness Analysis", {
    x: 0.5,
    y: 0.2,
    w: "90%",
    h: 0.5,
    fontSize: 24,
    color: "2563EB",
    bold: true,
  });

  try {
    console.log('Starting brand awareness chart creation');
    
    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      width: 800px;
      height: 400px;
      visibility: hidden;
      position: absolute;
      background-color: #FFFFFF;
    `;
    document.body.appendChild(tempContainer);

    // Get competitors and selected date range
    const storedCompetitors = localStorage.getItem('currentCompetitors');
    const competitors = storedCompetitors ? JSON.parse(storedCompetitors) : [];
    const chartElement = document.querySelector('.brand-awareness-chart');
    const selectedRange = chartElement?.getAttribute('data-selected-range') || "12";
    
    // Prepare chart data
    const allBrands = [brand, ...competitors].filter(b => b && b.trim() !== '');
    const chartData = await prepareChartData(brand, competitors, selectedRange);

    // Create chart wrapper
    const chartWrapper = document.createElement('div');
    chartWrapper.style.cssText = `
      width: 800px;
      height: 400px;
      background-color: #FFFFFF;
    `;
    tempContainer.appendChild(chartWrapper);

    // Render chart
    await new Promise<void>((resolve) => {
      const root = createRoot(chartWrapper);
      root.render(<BrandAwarenessChart data={chartData} brands={allBrands} />);
      setTimeout(resolve, 1000);
    });
    
    // Capture chart
    tempContainer.style.visibility = 'visible';
    const canvas = await html2canvas(tempContainer, {
      logging: true,
      useCORS: true,
      scale: 2,
      backgroundColor: '#FFFFFF',
      width: 800,
      height: 400
    });

    // Cleanup
    tempContainer.style.visibility = 'hidden';
    tempContainer.remove();

    // Add to slide
    const width = 6.8;
    const height = 3.4;
    const centerX = (10 - width) / 2;
    
    await awarenessSlide.addImage({
      data: canvas.toDataURL('image/png'),
      x: centerX,
      y: 1,
      w: width,
      h: height,
      sizing: {
        type: 'contain',
        w: width,
        h: height
      }
    });

    console.log('Chart image successfully added to slide');
  } catch (error) {
    console.error("Error capturing chart:", error);
    awarenessSlide.addText([
      { text: "Chart Generation Error\n", options: { bold: true, color: "FF0000" } },
      { text: "Failed to capture brand awareness chart. Please try regenerating the presentation.", options: { color: "475569" } }
    ], {
      x: 0.5,
      y: 2,
      w: "90%",
      h: 1,
      align: "center",
      fontSize: 14
    });
  }
};
