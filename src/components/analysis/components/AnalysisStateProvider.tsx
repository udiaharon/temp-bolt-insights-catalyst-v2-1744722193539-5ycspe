
import { useEffect, useRef } from "react";
import { usePreventFocusRerenders } from "@/hooks/use-prevent-focus-rerenders";
import { setPreventRerenderFlags } from "@/utils/presentation/utils/citations/preventRerenderUtils";

interface AnalysisStateProviderProps {
  children: React.ReactNode;
}

export const AnalysisStateProvider = ({ children }: AnalysisStateProviderProps) => {
  // Add refs to track state and prevent unnecessary re-renders
  const hasSetActiveSessionRef = useRef(false);
  const preventFirstRerenderRef = useRef(false);
  
  // Use our hook to prevent re-renders on focus changes with strict mode
  usePreventFocusRerenders({ 
    debug: true,
    onFocus: () => {
      // CRITICAL: Set ALL prevention flags on first focus
      if (!preventFirstRerenderRef.current) {
        preventFirstRerenderRef.current = true;
        document.documentElement.setAttribute('data-prevent-rerender', 'true');
        localStorage.setItem('PREVENT_FIRST_RERENDER', 'true');
        
        // Also set other prevention flags
        setPreventRerenderFlags();
      }
    }
  });

  // CRITICAL: Set active session flags SYNCHRONOUSLY (not in an effect)
  if (!hasSetActiveSessionRef.current) {
    hasSetActiveSessionRef.current = true;
    setPreventRerenderFlags();
    preventFirstRerenderRef.current = true;
  }

  // Set active session flags immediately on mount
  useEffect(() => {
    if (!hasSetActiveSessionRef.current) {
      // Mark this session as active to prevent re-renders on tab switches
      setPreventRerenderFlags();
      hasSetActiveSessionRef.current = true;
      preventFirstRerenderRef.current = true;
    }
    
    // CRITICAL: Set up sync storage listener to ensure consistency across tabs
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'PREVENT_FIRST_RERENDER' && e.newValue === 'true') {
        document.documentElement.setAttribute('data-prevent-rerender', 'true');
        preventFirstRerenderRef.current = true;
      }
      if (e.key === 'ACTIVE_ANALYSIS_SESSION' && e.newValue === 'true') {
        document.documentElement.setAttribute('data-analysis-active', 'true');
        hasSetActiveSessionRef.current = true;
      }
    };
    
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);
  
  return <>{children}</>;
};
