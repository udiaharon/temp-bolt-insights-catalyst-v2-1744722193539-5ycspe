
/**
 * Sets all necessary flags to prevent re-rendering on focus/blur
 */
export const setPreventRerenderFlags = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-analysis-active', 'true');
    document.documentElement.setAttribute('data-prevent-rerender', 'true');
  }
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ACTIVE_ANALYSIS_SESSION', 'true');
    localStorage.setItem('ANALYSIS_SESSION_TIMESTAMP', Date.now().toString());
    localStorage.setItem('NO_RERENDER_ON_FOCUS', 'true');
    localStorage.setItem('PREVENT_FIRST_RERENDER', 'true');
  }
  
  if (typeof window !== 'undefined') {
    window.PREVENT_STATE_SAVE = true;
  }
};

/**
 * Sets all flags needed before navigation to external citation link
 */
export const setCitationLinkFlags = (url: string) => {
  // Set all prevention flags
  setPreventRerenderFlags();
  
  // Set global flags specific to citation links
  if (typeof window !== 'undefined') {
    window.CITATION_LINK_CLICK_TIMESTAMP = Date.now();
  }
  
  // Set localStorage flags for persistence across tab switches
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('CITATION_LINK_ACTIVE', 'true');
    localStorage.setItem('CITATION_LINK_TIMESTAMP', Date.now().toString());
    localStorage.setItem('CITATION_LINK_PRESERVING_STATE', 'true');
    localStorage.setItem('CITATION_LINK_URL', url);
  }
};
