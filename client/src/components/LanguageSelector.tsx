import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

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
    
    // Refresh the page to apply translations
    window.location.reload();
  };

  const getTranslation = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLang?.flag}</span>
              <span>{currentLang?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Translation hook for components
export function useTranslation() {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const loadTranslations = async () => {
      const savedLanguage = localStorage.getItem('brezcode_language') || 'en';
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

    loadTranslations();
  }, []);

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  return { t, currentLanguage, translations };
}