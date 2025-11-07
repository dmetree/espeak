export const SUPPORTED_LOCALES = ["en", "ru", "pt"] as const;

export type TLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_LOCALES2 = {
  en: "English",
  ru: "Русский",
  pt: "Português",
} as const;
