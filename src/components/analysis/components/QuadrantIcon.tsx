
interface QuadrantIconProps {
  theme: string;
}

export const QuadrantIcon = ({ theme }: QuadrantIconProps) => (
  <div className="relative w-8 h-8 mr-3">
    <div className={`absolute top-0 left-0 w-1/2 h-1/2 ${theme === 'theme2' ? 'border border-white' : 'border-2 border-[#86EFAC]'} rounded-tl-sm`}></div>
    <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${theme === 'theme2' ? 'border border-white' : 'border-2 border-[#FCD34D]'} rounded-tr-sm`}></div>
    <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${theme === 'theme2' ? 'border border-white' : 'border-2 border-[#93C5FD]'} rounded-bl-sm`}></div>
    <div className={`absolute bottom-0 right-0 w-1/2 h-1/2 ${theme === 'theme2' ? 'border border-white' : 'border-2 border-[#FDA4AF]'} rounded-br-sm`}></div>
  </div>
);
