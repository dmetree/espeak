import en from "./messages/en.json";
// import es from "./messages/es.json";
import ru from "./messages/ru.json";
import pt from "./messages/pt.json";

import translate from "./messages/en.json"; // Adjust the path as needed

// Translation keys
const langList = translate["user-languages"];
const specialityList = translate["psy-speciality"];
const methodsList = translate["psy-methods"];
const servicesList = translate["psy-services"];

export const translations = { en, ru, pt };

// Load messages for a given locale
export const loadMessages = (locale) =>
  translations[locale] || translations["en"];

// Helper function to get a translated value by key
const getTranslation = (path, key) => {
  const paths = path.split(".");
  let current = translate;

  for (const segment of paths) {
    if (current[segment]) {
      current = current[segment];
    } else {
      return key; // Fallback if translation is not found
    }
  }
  return current[key] || key; // Return key if translation is not found
};

// Language options
export const getAllLangOptions = (t: any) => {
  return Object.entries(langList).map(([langCode, _]) => ({
    value: langCode,
    label: getTranslation("user-languages", langCode),
  }));
};

export const getOptionsFromCodes = (langCodes, t: any) => {
  return (
    langCodes?.map((langCode) => ({
      value: langCode,
      label: getTranslation("user-languages", langCode),
    })) || []
  );
};

// Specialities options
export const getAllSpecialityOptions = (t: any) => {
  return Object.entries(specialityList).map(([specialityCode, _]) => ({
    value: specialityCode,
    label: getTranslation("psy-speciality", specialityCode),
  }));
};

export const getOptionsFromSpeciality = (specialitiesCodes, t: any) => {
  return (
    specialitiesCodes?.map((specialityCode) => ({
      value: specialityCode,
      label: getTranslation("psy-speciality", specialityCode),
    })) || []
  );
};

// Methods options
export const getAllMethodsOptions = (t: any) => {
  return Object.entries(methodsList).map(([methodCode, _]) => ({
    value: methodCode,
    label: getTranslation("psy-methods", methodCode),
  }));
};

export const getOptionsFromMethods = (methodsCodes, t: any) => {
  return (
    methodsCodes?.map((methodCode) => ({
      value: methodCode,
      label: getTranslation("psy-methods", methodCode),
    })) || []
  );
};

// Services options
export const getAllServicesOptions = (t: any) => {
  return Object.entries(servicesList).map(([serviceCode, _]) => ({
    value: serviceCode,
    label: getTranslation("psy-services", serviceCode),
  }));
};

export const getOptionsFromServices = (servicesCodes, t: any) => {
  return (
    servicesCodes?.map((serviceCode) => ({
      value: serviceCode,
      label: getTranslation("psy-services", serviceCode),
    })) || []
  );
};
