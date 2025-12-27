export interface RarogThemeColorsScale {
  [shade: number]: string;
}

export interface RarogSemanticColors {
  bg: string;
  bgSoft: string;
  bgElevated: string;
  bgElevatedSoft: string;
  surface: string;
  borderSubtle: string;
  border: string;
  borderStrong: string;
  muted: string;
  text: string;
  textMuted: string;
  focusRing: string;
  accentSoft: string;
}

export interface RarogThemeColors {
  primary: RarogThemeColorsScale;
  secondary: RarogThemeColorsScale;
  success: RarogThemeColorsScale;
  danger: RarogThemeColorsScale;
  warning: RarogThemeColorsScale;
  info: RarogThemeColorsScale;
  semantic: RarogSemanticColors;
}

export interface RarogThemeConfig {
  colors: RarogThemeColors;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
}

export interface RarogConfig {
  theme: RarogThemeConfig;
  screens: Record<string, string>;
  mode?: "full" | "jit";
  content?: string[];
  variants?: {
    group?: string[];
    peer?: string[];
    data?: string[];
    [key: string]: string[] | undefined;
  };
  extend?: {
    colors?: Partial<RarogThemeColors>;
    spacing?: Record<string, string>;
    radius?: Record<string, string>;
    shadow?: Record<string, string>;
  };
  plugins?: Array<(config: RarogConfig) => void>;
}
