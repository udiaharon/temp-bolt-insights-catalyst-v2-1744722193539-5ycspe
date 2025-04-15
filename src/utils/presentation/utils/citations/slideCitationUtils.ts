
import { Citation, addCitationsToSlide } from "./addCitationsToSlide";
import { useCitationNavigation } from "./useCitationNavigation";
import { setPreventRerenderFlags, setCitationLinkFlags } from "./preventRerenderUtils";

// Re-export all citation utilities
export { addCitationsToSlide, useCitationNavigation, setPreventRerenderFlags, setCitationLinkFlags };
// Re-export the Citation type with the 'export type' syntax to comply with isolatedModules
export type { Citation };
