
// Store for managing language selection

// Available languages with English first, rest sorted alphabetically
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' }
];

// Get language from localStorage or default to English
export const getSelectedLanguage = (): string => {
  return localStorage.getItem('selectedLanguage') || 'en';
};

// Get language name from code
export const getLanguageName = (code: string): string => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : 'English';
};

// Set language in localStorage
export const setSelectedLanguage = (code: string): void => {
  localStorage.setItem('selectedLanguage', code);
};
