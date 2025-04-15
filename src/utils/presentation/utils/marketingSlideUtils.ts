
import pptxgen from "pptxgenjs";
import { MarketingC } from "../types/presentationTypes";
import { getMarketingCIcon } from "./iconUtils";

export const createMarketingCSlides = (
  pptx: pptxgen,
  marketingCs: MarketingC[]
) => {
  marketingCs.forEach((marketingC) => {
    const slide = pptx.addSlide();
    slide.background = { color: "F1F5F9" };

    const icon = getMarketingCIcon(marketingC.title);
    slide.addText(`${icon} ${marketingC.title}`, {
      x: 0.5,
      y: 0.2,
      w: "90%",
      h: 0.5,
      fontSize: 24,
      color: "2563EB",
      bold: true,
    });

    const topicsCount = marketingC.topics.length;
    const heightPerTopic = 1.5;
    const topicsStartY = 1.0;

    marketingC.topics.forEach((topic, index) => {
      const topicStartY = topicsStartY + (index * heightPerTopic);

      slide.addText(topic.headline, {
        x: 0.5,
        y: topicStartY,
        w: "90%",
        h: 0.25,
        fontSize: 14,
        color: "334155",
        bold: true,
      });

      const insightText = topic.insights.map(insight => ({
        text: insight,
        options: {
          bullet: { indent: 12 },
          indentLevel: 1,
          breakLine: true,
          fontSize: 11,
          color: "475569",
          paragraphSpacing: 2
        }
      }));

      slide.addText(insightText, {
        x: 0.3,
        y: topicStartY + 0.25,
        w: "95%",
        h: 1.2,
        align: "left",
      });
    });
  });
};
