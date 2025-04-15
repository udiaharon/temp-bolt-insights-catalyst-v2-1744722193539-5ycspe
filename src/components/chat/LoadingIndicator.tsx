
export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg p-3 [html[data-theme=default]_&]:bg-gray-100 [html[data-theme=theme2]_&]:bg-blue-50">
        <div className="flex space-x-2">
          <div className="w-2 h-2 [html[data-theme=default]_&]:bg-gray-400 [html[data-theme=theme2]_&]:bg-[#3E66FB] rounded-full animate-bounce" />
          <div className="w-2 h-2 [html[data-theme=default]_&]:bg-gray-400 [html[data-theme=theme2]_&]:bg-[#3E66FB] rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 [html[data-theme=default]_&]:bg-gray-400 [html[data-theme=theme2]_&]:bg-[#3E66FB] rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};
