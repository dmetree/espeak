export const getLocalizedContent = (obj, locale) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj[locale]) return obj[locale];
  return obj['en'] || ''; // fallback
};
