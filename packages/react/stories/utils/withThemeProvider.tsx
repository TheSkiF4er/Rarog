import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * withThemeProvider.tsx
 * Утилита для Storybook — ThemeProvider и декоратор для сторис @rarog/react
 *
 * Цели:
 * - Простая подмена тем (light / dark) для сторис
 * - Внедрение CSS custom properties (tokens) в <head> через style tag — имитирует rarog.theme.css
 * - Экспорт декоратора `withThemeProvider` для использования в .storybook/preview
 *
 * Автор: TheSkiF4er
 * Язык: TypeScript + React
 * Лицензия: Apache-2.0
 */

export type RarogTheme = 'light' | 'dark' | 'custom';

export type ThemeTokens = Record<string, string | number>;

export interface ThemeProviderProps {
  /** текущее название темы */
  initialTheme?: RarogTheme;
  /** токены (CSS custom properties) в формате { '--tone-primary': '30 120 255', ... } */
  tokens?: ThemeTokens;
  /** позволяет показывать небольшой тулбар для переключения (в сторис) */
  showSwitcher?: boolean;
  children?: React.ReactNode;
}

const DEFAULT_LIGHT_TOKENS: ThemeTokens = {
  '--tone-primary': '30 120 255',
  '--tone-secondary': '96 132 255',
  '--tone-surface': '255 255 255',
  '--tone-on-surface': '18 18 20',
  '--r-radius-md': '12px',
  '--r-spacing-s3': '12px'
};

const DEFAULT_DARK_TOKENS: ThemeTokens = {
  '--tone-primary': '100 160 255',
  '--tone-secondary': '140 160 255',
  '--tone-surface': '18 18 20',
  '--tone-on-surface': '235 238 240',
  '--r-radius-md': '12px',
  '--r-spacing-s3': '12px'
};

// Контекст темы (удобно использовать в story-level hooks)
const ThemeContext = createContext<{
  theme: RarogTheme;
  setTheme: (t: RarogTheme) => void;
  tokens: ThemeTokens;
}>({ theme: 'light', setTheme: () => {}, tokens: DEFAULT_LIGHT_TOKENS });

export function useRarogTheme() {
  return useContext(ThemeContext);
}

// Вспомогательная функция: применяем tokens как CSS переменные в <html>
function applyTokensToDocument(tokens: ThemeTokens, scope: HTMLElement = document.documentElement) {
  Object.keys(tokens).forEach((k) => {
    try {
      scope.style.setProperty(k, String(tokens[k]));
    } catch (e) {
      // ignore invalid property names
    }
  });
}

function removeTokensFromDocument(tokens: ThemeTokens, scope: HTMLElement = document.documentElement) {
  Object.keys(tokens).forEach((k) => {
    try {
      scope.style.removeProperty(k);
    } catch (e) {
      // ignore
    }
  });
}

/** ThemeProvider компонент */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = 'light',
  tokens,
  showSwitcher = true,
  children
}) => {
  const [theme, setTheme] = useState<RarogTheme>(initialTheme);

  const themeTokens = useMemo<ThemeTokens>(() => {
    if (tokens && Object.keys(tokens).length) return tokens;
    return theme === 'dark' ? DEFAULT_DARK_TOKENS : DEFAULT_LIGHT_TOKENS;
  }, [theme, tokens]);

  // apply tokens and body class when theme changes
  useEffect(() => {
    // apply tokens as CSS variables to :root
    applyTokensToDocument(themeTokens, document.documentElement);

    // add body class for theme (useful for css selectors)
    document.documentElement.classList.remove('rarog-theme-light', 'rarog-theme-dark');
    document.documentElement.classList.add(theme === 'dark' ? 'rarog-theme-dark' : 'rarog-theme-light');

    return () => {
      // cleanup tokens on unmount — remove only those we set
      removeTokensFromDocument(themeTokens, document.documentElement);
      document.documentElement.classList.remove('rarog-theme-light', 'rarog-theme-dark');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, JSON.stringify(themeTokens)]);

  const value = useMemo(() => ({ theme, setTheme, tokens: themeTokens }), [theme, themeTokens]);

  return (
    <ThemeContext.Provider value={value}>
      {showSwitcher && <ThemeSwitcher current={theme} onChange={setTheme} />}
      {children}
    </ThemeContext.Provider>
  );
};

/** Простой ThemeSwitcher — маленькая панель для сторибука */
const ThemeSwitcher: React.FC<{ current: RarogTheme; onChange: (t: RarogTheme) => void }> = ({ current, onChange }) => {
  const styles: React.CSSProperties = {
    position: 'fixed',
    right: 12,
    bottom: 12,
    zIndex: 99999,
    background: 'rgba(255,255,255,0.9)',
    color: '#111',
    borderRadius: 8,
    padding: '6px 8px',
    boxShadow: '0 6px 18px rgba(9,30,66,0.08)',
    fontSize: 12,
    display: 'flex',
    gap: 6,
    alignItems: 'center'
  };

  // minimal dark mode adaptation
  const darkStyles: React.CSSProperties = {
    background: 'rgba(18,18,20,0.86)',
    color: '#eee'
  };

  const isDark = current === 'dark';

  return (
    <div style={{ ...styles, ...(isDark ? darkStyles : {}) }} aria-hidden>
      <button
        onClick={() => onChange('light')}
        style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        aria-pressed={current === 'light'}
      >
        Light
      </button>
      <button
        onClick={() => onChange('dark')}
        style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        aria-pressed={current === 'dark'}
      >
        Dark
      </button>
      <button
        onClick={() => onChange('custom')}
        style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        aria-pressed={current === 'custom'}
      >
        Custom
      </button>
    </div>
  );
};

/** Storybook decorator: withThemeProvider
 *
 * Usage in .storybook/preview.tsx:
 * import { withThemeProvider } from '../packages/react/stories/utils/withThemeProvider';
 * export const decorators = [withThemeProvider];
 */
export const withThemeProvider = (Story: any, context: any) => {
  // allow overriding initial theme via story context (args or globals)
  const initial = (context?.globals && context.globals['theme']) || context?.args?.initialTheme || 'light';
  return (
    <ThemeProvider initialTheme={initial} showSwitcher={true}>
      <Story {...context} />
    </ThemeProvider>
  );
};

export default ThemeProvider;
