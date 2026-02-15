declare module "tailwindcss" {
  export interface Config {
    darkMode?: string | string[];
    content?: string | string[];
    theme?: object;
    plugins?: unknown[];
    [key: string]: unknown;
  }
}
