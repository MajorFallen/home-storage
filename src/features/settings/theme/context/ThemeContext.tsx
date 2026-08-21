/* src/shared/context/ThemeContext.tsx */
import React, { createContext, useContext, useEffect, useState } from 'react';

// Vite automatycznie importuje wszystkie pliki .css w katalogu themes
const themeFiles = import.meta.glob('/src/styles/themes/*.css', { eager: true });

export interface ThemeInfo {
  id: string;
  label: string;
}

// Zamienia nazwę pliku, np. "dark-fuchsia" -> "Dark Fuchsia"
const formatThemeLabel = (id: string): string => {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Ekstrakcja nazw motywów ze ścieżek plików
const getAvailableThemes = (): ThemeInfo[] => {
  const themes: ThemeInfo[] = [];

  Object.keys(themeFiles).forEach((path) => {
    const match = path.match(/\/([^\/]+)\.css$/);
    if (match && match[1]) {
      const id = match[1];
      themes.push({
        id,
        label: formatThemeLabel(id),
      });
    }
  });

  return themes.length > 0
    ? themes
    : [{ id: 'light-slate', label: 'Light Slate' }];
};

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'app-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const availableThemes = getAvailableThemes();

  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && availableThemes.some((t) => t.id === savedTheme)) {
      return savedTheme;
    }
    return availableThemes[0]?.id || 'light-slate';
  });

  const handleSetTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};