export const SUPPORTED_LOCALES = ["en", "ru"] as const;

export type TLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_LOCALES2 = {
  en: "English",
  ru: "Русский",
} as const;
