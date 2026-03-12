module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    colors: {
      primary: { 600: '#5b21b6' },
      secondary: { 600: '#334155' },
      success: { 600: '#16a34a' },
      danger: { 600: '#dc2626' },
      warning: { 600: '#ea580c' },
      info: { 600: '#0284c7' },
      semantic: {
        bg: '#f8fafc', bgSoft: '#ffffff', bgElevated: '#ffffff', bgElevatedSoft: '#f8fafc',
        surface: '#ffffff', border: '#e2e8f0', borderSubtle: '#eef2ff', borderStrong: '#1e293b',
        muted: '#94a3b8', text: '#0f172a', textMuted: '#64748b', focusRing: '#8b5cf6', accentSoft: '#f5f3ff'
      }
    },
    spacing: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 6: '1.5rem', 8: '2rem' },
    radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
    shadow: { sm: '0 1px 2px rgba(15,23,42,0.08)', md: '0 8px 24px rgba(15,23,42,0.16)' }
  },
  plugins: []
};
