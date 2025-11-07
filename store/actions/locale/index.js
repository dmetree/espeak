import { LocaleActionTypes } from "@/store/actionTypes";

// Action to set the locale

export const setLocale = (locale) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
  }
  return {
    type: LocaleActionTypes.SET_LOCALE,
    payload: locale,
  };
};
