
import { FC } from "react";

export const LoadingState: FC = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
    </div>
  );
};
