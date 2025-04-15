
/**
 * Configuration constants for trend slides layout
 */
export const trendSlideLayout = {
  // Slide position settings
  slideTitle: {
    x: 0.5,
    y: 0.2,
    width: 9,  // Changed from "90%" to numeric value
    height: 0.5,
    fontSize: 24,
    color: "2563EB",
    bold: true,
    fontFace: "Arial",
  },
  
  relatedCategories: {
    x: 0.5,
    y: 0.7,
    width: 9,  // Changed from "90%" to numeric value
    height: 0.3,
    fontSize: 10,
    color: "666666",
  },
  
  // Grid layout settings
  grid: {
    columns: 2,
    rows: 4,
    startX: 0.5,
    startY: 1.1,
    cellWidth: 4.25,
    cellHeight: 1.0,
    gapX: 0.3,
    gapY: 0.1,
  },
  
  // Cell styling
  cell: {
    backgroundColor: "D3E4FD",
    borderColor: "FFFFFF",
    borderWidth: 1,
    cornerRadius: 5,
    padding: 0.1,
    fontSize: 8,
    textColor: "333333",
  },
  
  // Footer settings
  footer: {
    x: 0.5,
    y: 6.7,
    width: 9.5,  // Changed from "95%" to numeric value
    height: 0.3,
    fontSize: 8,
    color: "666666",
  }
};
