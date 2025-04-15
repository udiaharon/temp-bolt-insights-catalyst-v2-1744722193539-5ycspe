interface DetailedAnalysisSectionProps {
  title: string;
  content: string | undefined;
}

export const DetailedAnalysisSection = ({ title, content }: DetailedAnalysisSectionProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">{title}:</h4>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
};