import { useEffect } from 'react';

export const GoogleSearch = () => {
  useEffect(() => {
    // This ensures the search element is properly initialized
    if ((window as any).google) {
      (window as any).google.search.cse.element.render({
        div: 'google-search-box',
        tag: 'search',
        gname: 'gsearch'
      });
    }
  }, []);

  return (
    <div id="google-search-box" className="hidden"></div>
  );
};