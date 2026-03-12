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

export interface RarogPluginDiagnostic {
  level: "info" | "warn" | "error";
  message: string;
}

export interface RarogPluginCapabilities {
  utilities?: boolean;
  components?: boolean;
  tokens?: boolean;
  themes?: boolean;
  js?: boolean;
  diagnostics?: boolean;
}

export interface RarogPluginManifest {
  apiVersion: 1;
  name: string;
  version: string;
  displayName?: string;
  description?: string;
  engine?: {
    rarog: string;
  };
  compatibility?: string;
  capabilities?: RarogPluginCapabilities;
  keywords?: string[];
  official?: boolean;
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
  plugins?: RarogPlugin[];
}

export interface RarogPluginContext {
  config: RarogConfig;
  meta?: {
    mode: "full" | "jit";
    rootDir: string;
    env: string;
  };
  helpers?: {
    warn(message: string): void;
  };
}

export interface RarogPluginResult {
  utilitiesCss?: string;
  componentsCss?: string;
  diagnostics?: RarogPluginDiagnostic[];
}

export interface RarogPluginObject {
  __rarogPlugin: true;
  manifest: RarogPluginManifest;
  setup(ctx: RarogPluginContext): void | RarogPluginResult;
}

export type RarogLegacyPlugin = (ctx: Pick<RarogPluginContext, "config">) => void | RarogPluginResult;
export type RarogPlugin = RarogLegacyPlugin | RarogPluginObject | string;
