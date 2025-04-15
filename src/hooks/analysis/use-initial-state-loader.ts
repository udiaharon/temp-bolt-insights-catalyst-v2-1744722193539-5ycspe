
import { useState, useEffect, useRef } from 'react';
import { InitialState } from '@/types/analysis';
import { setPreventRerenderFlags } from '@/utils/presentation/utils/citations/preventRerenderUtils';

export const useInitialStateLoader = (initialState?: InitialState) => {
  const [hasInitialStateLoaded, setHasInitialStateLoaded] = useState(false);
  const initialStateLoadedRef = useRef(false);
  const hasSetActiveSessionRef = useRef(false);
  
  useEffect(() => {
    if (initialState && !hasInitialStateLoaded && !initialStateLoadedRef.current) {
      console.log('Loading initial state:', initialState);
      initialStateLoadedRef.current = true;
      
      // Set session flags to prevent re-renders
      if (!hasSetActiveSessionRef.current) {
        localStorage.setItem('ACTIVE_ANALYSIS_SESSION', 'true');
        localStorage.setItem('ANALYSIS_SESSION_TIMESTAMP', Date.now().toString());
        localStorage.setItem('NO_RERENDER_ON_FOCUS', 'true');
        document.documentElement.setAttribute('data-analysis-active', 'true');
        hasSetActiveSessionRef.current = true;
      }
      
      setHasInitialStateLoaded(true);
    } else if (!initialState && !hasInitialStateLoaded) {
      setHasInitialStateLoaded(true);
      initialStateLoadedRef.current = true;
    }
  }, [initialState, hasInitialStateLoaded]);

  return {
    hasInitialStateLoaded,
    setHasInitialStateLoaded,
    initialStateLoadedRef,
    hasSetActiveSessionRef
  };
};
