
import { useEffect, useRef, useCallback } from 'react';

type PreventRerenderOptions = {
  onBlur?: () => void;
  onFocus?: () => void;
  debug?: boolean;
};

/**
 * Hook to prevent re-renders when opening external links or when window focus changes.
 * This is particularly useful for citation links and other external navigation.
 */
export const usePreventFocusRerenders = (options: PreventRerenderOptions = {}) => {
  const { onBlur, onFocus, debug = false } = options;
  
  // Refs to track state without causing re-renders
  const isExternalNavigationRef = useRef(false);
  const navigationTimestampRef = useRef(0);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ignoreNextFocusEventRef = useRef(false);
  
  // Log helper
  const log = useCallback((message: string) => {
    if (debug) console.log(`[FocusManager] ${message}`);
  }, [debug]);

  // Set up handlers on mount
  useEffect(() => {
    // CRITICAL FIX: Check localStorage at startup to maintain state
    const isCitationLinkActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
    const citationTimestamp = localStorage.getItem('CITATION_LINK_TIMESTAMP');
    
    if (isCitationLinkActive && citationTimestamp) {
      const timestamp = parseInt(citationTimestamp, 10);
      if (!isNaN(timestamp) && Date.now() - timestamp < 300000) { // within 5 minutes
        log('Detected active citation link state from storage on mount');
        isExternalNavigationRef.current = true;
        navigationTimestampRef.current = timestamp;
        window.PREVENT_STATE_SAVE = true;
      }
    }
    
    // Helper to detect if current focus change is due to external navigation
    const isExternalNavigation = () => {
      // Check multiple sources to ensure robust detection
      return (
        // Check our internal refs
        isExternalNavigationRef.current ||
        ignoreNextFocusEventRef.current ||
        // Check our global flag (set by citation handlers)
        window.PREVENT_STATE_SAVE === true ||
        // Check localStorage flags (redundant approach)
        localStorage.getItem('CITATION_LINK_ACTIVE') === 'true' ||
        localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true' ||
        // Check data attribute on document root
        document.documentElement.hasAttribute('data-citation-click') ||
        // Check timestamp to see if we're within the navigation cool-down period
        (navigationTimestampRef.current > 0 &&
         Date.now() - navigationTimestampRef.current < 300000) // 5 minutes cool-down
      );
    };

    // Handle window blur (losing focus)
    const handleBlur = (e: FocusEvent) => {
      log(`Blur event detected, target: ${e.target?.constructor.name}`);
      
      // CRITICAL: Detect if we're navigating to a citation and set flags accordingly
      if (document.documentElement.hasAttribute('data-citation-click')) {
        log('Blur occurring with citation click active - ensuring flag persistence');
        isExternalNavigationRef.current = true;
        window.PREVENT_STATE_SAVE = true;
        navigationTimestampRef.current = Date.now();
        ignoreNextFocusEventRef.current = true;
        
        // Update localStorage to ensure flags persist across tab navigation
        localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
        localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
        localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
      }
      
      if (isExternalNavigation()) {
        log('Blur detected, but ignoring due to external navigation');
        // Set the flag to ignore the next focus event
        ignoreNextFocusEventRef.current = true;
        return;
      }
      
      log('Window lost focus - not from external navigation');
      if (onBlur) onBlur();
    };

    // Handle window focus (gaining focus)
    const handleFocus = (e: FocusEvent) => {
      log(`Focus event detected, target: ${e.target?.constructor.name}`);
      
      // Get citation link status directly from localStorage
      const isCitationLinkActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
      const isPreservingState = localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true';
      
      if (isCitationLinkActive || isPreservingState || isExternalNavigation() || ignoreNextFocusEventRef.current) {
        log('Focus detected, but ignoring due to external navigation');
        
        // Reset the ignore flag but maintain the external navigation state
        ignoreNextFocusEventRef.current = false;
        
        // CRITICAL: Don't clear localStorage flags immediately - components might still need to check them
        // Just schedule clearing after a longer delay to ensure all components have processed them
        setTimeout(() => {
          // We delay this check to avoid race conditions - we want to be sure all components have had a chance to check
          const shouldStillClear = !document.documentElement.hasAttribute('data-citation-click');
          
          if (shouldStillClear) {
            log('Clearing localStorage flags after citation link return (delayed)');
            localStorage.removeItem('CITATION_LINK_ACTIVE');
            localStorage.removeItem('CITATION_LINK_TIMESTAMP');
            localStorage.removeItem('CITATION_LINK_PRESERVING_STATE');
            localStorage.removeItem('CITATION_LINK_URL');
            
            // Only clear document attribute after ensuring all focus handlers have run
            document.documentElement.removeAttribute('data-citation-click');
          }
        }, 2000); // Much longer delay to ensure all components have processed return from citation
        
        return;
      }
      
      log('Window gained focus - not from external navigation');
      if (onFocus) onFocus();
    };

    // Handle direct citation link clicks 
    const handleCitationLinkClick = (event: Event) => {
      log('Citation link click event detected');
      
      // Set all flags to prevent re-renders
      isExternalNavigationRef.current = true;
      window.PREVENT_STATE_SAVE = true;
      navigationTimestampRef.current = Date.now();
      ignoreNextFocusEventRef.current = true;
      
      // Set localStorage flags whenever a citation link is clicked
      localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
      localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
      localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
      
      // Set data attribute as another detection mechanism
      document.documentElement.setAttribute('data-citation-click', 'true');
      
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      // Set a timeout to reset the flags after 5 minutes
      navigationTimeoutRef.current = setTimeout(() => {
        log('Resetting navigation flags after timeout');
        isExternalNavigationRef.current = false;
        window.PREVENT_STATE_SAVE = false;
        navigationTimestampRef.current = 0;
        ignoreNextFocusEventRef.current = false;
        navigationTimeoutRef.current = null;
        
        // Clear localStorage flags
        localStorage.removeItem('CITATION_LINK_ACTIVE');
        localStorage.removeItem('CITATION_LINK_TIMESTAMP');
        localStorage.removeItem('CITATION_LINK_PRESERVING_STATE');
        localStorage.removeItem('CITATION_LINK_URL');
        
        // Clear data attribute
        document.documentElement.removeAttribute('data-citation-click');
      }, 300000); // 5 minutes
    };

    // Handle document clicks to catch citation links
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const citationLink = target.closest('[data-citation-link="true"]');
      
      if (citationLink) {
        log('Citation link click detected via document click');
        
        // Set all flags to prevent re-renders
        isExternalNavigationRef.current = true;
        window.PREVENT_STATE_SAVE = true;
        navigationTimestampRef.current = Date.now();
        ignoreNextFocusEventRef.current = true;
        
        // Set localStorage flags as fallback
        localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
        localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
        localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
        
        // Set a data attribute as another detection mechanism
        document.documentElement.setAttribute('data-citation-click', 'true');
      }
    };

    // Set up a more aggressive capture of all click events
    const captureAllExternalLinks = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Check if it's an anchor tag with target="_blank" or rel containing "external"
      const externalLink = target.closest('a[target="_blank"], a[rel*="external"], a[href^="http"]');
      
      if (externalLink && !target.closest('[data-internal-link="true"]')) {
        log('External link click detected');
        
        // Set all flags to prevent re-renders
        isExternalNavigationRef.current = true;
        window.PREVENT_STATE_SAVE = true;
        navigationTimestampRef.current = Date.now();
        ignoreNextFocusEventRef.current = true;
        
        // Set localStorage flags as fallback
        localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
        localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
        localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
      }
    };

    // Set up MutationObserver to detect data-citation-click attribute
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-citation-click' && 
            document.documentElement.getAttribute('data-citation-click') === 'true') {
          log('Citation click detected via MutationObserver');
          
          isExternalNavigationRef.current = true;
          window.PREVENT_STATE_SAVE = true;
          navigationTimestampRef.current = Date.now();
          ignoreNextFocusEventRef.current = true;
          
          // Set localStorage flags for persistence
          localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
          localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
          localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
        }
      }
    });
    
    observer.observe(document.documentElement, { attributes: true });

    // CRITICAL FIX: Use capture phase for these events to ensure we intercept them early
    window.addEventListener('blur', handleBlur, { capture: true, passive: true });
    window.addEventListener('focus', handleFocus, { capture: true, passive: true });
    window.addEventListener('citationLinkClick', handleCitationLinkClick, { capture: true, passive: true });
    document.addEventListener('click', handleDocumentClick, { capture: true, passive: true });
    document.addEventListener('click', captureAllExternalLinks, { capture: true, passive: true });
    
    // Add a visibilitychange listener as another way to detect focus changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // CRITICAL: Check if citation flags are set when visibility changes
        if (document.documentElement.hasAttribute('data-citation-click')) {
          log('Visibility hidden with citation click active - ensuring flag persistence');
          localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
          localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
          localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
        }
        
        if (isExternalNavigation()) {
          log('Visibility hidden, but ignoring due to external navigation');
          return;
        }
        log('Document hidden - not from external navigation');
        if (onBlur) onBlur();
      } else if (document.visibilityState === 'visible') {
        // Check localStorage directly for citation status to handle edge cases
        const isCitationLinkActive = localStorage.getItem('CITATION_LINK_ACTIVE') === 'true';
        const isPreservingState = localStorage.getItem('CITATION_LINK_PRESERVING_STATE') === 'true';
        
        if (isCitationLinkActive || isPreservingState || isExternalNavigation() || ignoreNextFocusEventRef.current) {
          log('Visibility visible, but ignoring due to external navigation');
          ignoreNextFocusEventRef.current = false;
          return;
        }
        log('Document visible - not from external navigation');
        if (onFocus) onFocus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, { capture: true, passive: true });
    
    // CRITICAL FIX: Handle the beforeunload event to set navigation flags
    const handleBeforeUnload = () => {
      if (document.documentElement.hasAttribute('data-citation-click')) {
        log('beforeunload detected with citation click active - ensuring flag persistence');
        localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
        localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true, passive: true });
    
    // CRITICAL FIX: Handle page transitions in SPA
    const handlePageTransition = () => {
      // Check if we have citation link active and ensure flags persist
      if (document.documentElement.hasAttribute('data-citation-click')) {
        log('Page transition detected with citation click active - ensuring flag persistence');
        localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
        localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
      }
    };
    
    // Detect page navigations in a SPA
    window.addEventListener('popstate', handlePageTransition);
    
    // Cleanup
    return () => {
      window.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('citationLinkClick', handleCitationLinkClick, true);
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('click', captureAllExternalLinks, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('beforeunload', handleBeforeUnload, true);
      window.removeEventListener('popstate', handlePageTransition);
      observer.disconnect();
      
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [onBlur, onFocus, debug, log]);

  // Expose methods for manual control (useful for file downloads or other cases)
  const startExternalNavigation = useCallback(() => {
    isExternalNavigationRef.current = true;
    window.PREVENT_STATE_SAVE = true;
    navigationTimestampRef.current = Date.now();
    ignoreNextFocusEventRef.current = true;
    
    // CRITICAL ADDITION: Set localStorage flags whenever external navigation starts
    localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
    localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
    localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
    
    // Set data attribute
    document.documentElement.setAttribute('data-citation-click', 'true');
    
    if (debug) console.log('[FocusManager] External navigation started manually');
  }, [debug]);

  const endExternalNavigation = useCallback(() => {
    isExternalNavigationRef.current = false;
    window.PREVENT_STATE_SAVE = false;
    navigationTimestampRef.current = 0;
    ignoreNextFocusEventRef.current = false;
    
    // Clear localStorage flags
    localStorage.removeItem('CITATION_LINK_ACTIVE');
    localStorage.removeItem('CITATION_LINK_TIMESTAMP');
    localStorage.removeItem('CITATION_LINK_PRESERVING_STATE');
    localStorage.removeItem('CITATION_LINK_URL');
    
    // Clear data attribute
    document.documentElement.removeAttribute('data-citation-click');
    
    if (debug) console.log('[FocusManager] External navigation ended manually');
  }, [debug]);

  return {
    startExternalNavigation,
    endExternalNavigation
  };
};
