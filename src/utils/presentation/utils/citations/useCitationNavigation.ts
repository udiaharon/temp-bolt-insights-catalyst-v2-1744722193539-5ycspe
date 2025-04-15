
import { useCallback, useEffect, useRef } from "react";
import { usePreventFocusRerenders } from "@/hooks/use-prevent-focus-rerenders";
import { setCitationLinkFlags, setPreventRerenderFlags } from "./preventRerenderUtils";

/**
 * React hook for handling citation navigation without triggering re-renders
 */
export const useCitationNavigation = () => {
  const { startExternalNavigation } = usePreventFocusRerenders({ debug: true });
  const preventFirstRerenderRef = useRef(false);
  
  // CRITICAL: Set document attributes SYNCHRONOUSLY during hook initialization
  // This ensures they're set before any focus/blur events can happen
  if (!preventFirstRerenderRef.current) {
    preventFirstRerenderRef.current = true;
    setPreventRerenderFlags();
  }
  
  // Set up event listeners once on initial render
  useEffect(() => {
    // Double-check our flags are set on mount
    if (!preventFirstRerenderRef.current) {
      preventFirstRerenderRef.current = true;
      setPreventRerenderFlags();
    }
    
    // CRITICAL: Add listener for changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'PREVENT_FIRST_RERENDER' && e.newValue === 'true') {
        document.documentElement.setAttribute('data-prevent-rerender', 'true');
        preventFirstRerenderRef.current = true;
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // CRITICAL: Add listener for visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When tab becomes hidden, reinforce our flags
        setPreventRerenderFlags();
      } else if (document.visibilityState === 'visible') {
        // When tab becomes visible again, check our flags
        if (!preventFirstRerenderRef.current) {
          preventFirstRerenderRef.current = true;
          document.documentElement.setAttribute('data-prevent-rerender', 'true');
          localStorage.setItem('PREVENT_FIRST_RERENDER', 'true');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const handleCitationClick = useCallback((e: React.MouseEvent<HTMLElement> | null, url: string) => {
    if (!url) return;
    
    // If called from an event, prevent default
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // CRITICAL: Set ALL prevention flags BEFORE navigation
    preventFirstRerenderRef.current = true;
    setCitationLinkFlags(url);
    
    console.log("Citation navigation initiated to:", url);
    
    // Use the focus prevention hook
    startExternalNavigation();
    
    // Dispatch multiple custom events for redundancy
    // 1. A standard event
    const event = new CustomEvent('citationLinkClick', { detail: { url } });
    window.dispatchEvent(event);
    
    // 2. A click event on the document with a data attribute
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    // Create a temporary element for the click event
    const tempElement = document.createElement('a');
    tempElement.setAttribute('data-citation-link', 'true');
    tempElement.setAttribute('href', url);
    tempElement.setAttribute('target', '_blank');
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    tempElement.dispatchEvent(clickEvent);
    document.body.removeChild(tempElement);
    
    // Use a timeout to ensure all state is properly set before opening URL
    setTimeout(() => {
      // Open the URL safely
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500); // Increased timeout for reliable flag setting
  }, [startExternalNavigation]);
  
  return { handleCitationClick };
};
