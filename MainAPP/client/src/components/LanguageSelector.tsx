import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect browser language or load from localStorage
    const savedLanguage = localStorage.getItem('brezcode_language');
    const browserLanguage = navigator.language.toLowerCase();
    
    let detectedLanguage = 'en';
    if (savedLanguage) {
      detectedLanguage = savedLanguage;
    } else if (languages.some(lang => lang.code === browserLanguage)) {
      detectedLanguage = browserLanguage;
    } else if (languages.some(lang => lang.code === browserLanguage.split('-')[0])) {
      detectedLanguage = languages.find(lang => lang.code.startsWith(browserLanguage.split('-')[0]))?.code || 'en';
    }
    
    setCurrentLanguage(detectedLanguage);
    loadTranslations(detectedLanguage);
  }, []);

  const loadTranslations = async (languageCode: string) => {
    try {
      const response = await fetch(`/api/translations/${languageCode}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      }
    } catch (error) {
      console.warn('Failed to load translations:', error);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('brezcode_language', languageCode);
    
    // Load new translations
    await loadTranslations(languageCode);
    
    // If user is logged in, save preference to backend
    try {
      const response = await fetch('/api/user/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ languageCode }),
      });
      if (!response.ok) {
        console.warn('Failed to save language preference');
      }
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
    
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
  };

  const getTranslation = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center gap-2">
      <Globe className="w-4 h-4 text-yellow-400" />
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          className="w-[140px] border-yellow-400/30 bg-transparent text-yellow-400 hover:bg-yellow-400/10 focus:ring-yellow-400 focus:ring-2 justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <span>{currentLang?.flag}</span>
            <span className="text-sm text-yellow-400">{currentLang?.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-yellow-400" />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-yellow-400/20 rounded-md shadow-xl z-[9999] min-w-[140px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="w-full px-3 py-2 text-left hover:bg-yellow-50 focus:bg-yellow-50 first:rounded-t-md last:rounded-b-md transition-colors"
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="text-sm text-gray-700">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Translation hook for components
export function useTranslation() {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const loadTranslations = async (lang?: string) => {
      const savedLanguage = lang || localStorage.getItem('brezcode_language') || 'en';
      setCurrentLanguage(savedLanguage);
      
      try {
        const response = await fetch(`/api/translations/${savedLanguage}`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
        console.warn('Failed to load translations:', error);
      }
    };

    // Initial load
    loadTranslations();

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      loadTranslations(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  return { t, currentLanguage };
}

// Language Context for global state management
interface LanguageContextType {
  currentLanguage: string;
  translations: Record<string, string>;
  changeLanguage: (languageCode: string) => Promise<void>;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Detect browser language or load from localStorage
    const savedLanguage = localStorage.getItem('brezcode_language');
    const browserLanguage = navigator.language.toLowerCase();
    
    let detectedLanguage = 'en';
    if (savedLanguage) {
      detectedLanguage = savedLanguage;
    } else if (languages.some(lang => lang.code === browserLanguage)) {
      detectedLanguage = browserLanguage;
    } else if (languages.some(lang => lang.code === browserLanguage.split('-')[0])) {
      detectedLanguage = languages.find(lang => lang.code.startsWith(browserLanguage.split('-')[0]))?.code || 'en';
    }
    
    setCurrentLanguage(detectedLanguage);
    loadTranslations(detectedLanguage);
  }, []);

  const loadTranslations = async (languageCode: string) => {
    try {
      const response = await fetch(`/api/translations/${languageCode}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      }
    } catch (error) {
      console.warn('Failed to load translations:', error);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('brezcode_language', languageCode);
    
    // Load new translations
    await loadTranslations(languageCode);
    
    // Emit language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
    
    // If user is logged in, save preference to backend
    try {
      const response = await fetch('/api/user/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ languageCode }),
      });
      if (!response.ok) {
        console.warn('Failed to save language preference');
      }
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, translations, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}