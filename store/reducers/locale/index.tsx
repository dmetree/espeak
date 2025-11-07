import { LocaleActionTypes } from '@/store/actionTypes';
import { TLocale, SUPPORTED_LOCALES } from '@/components/shared/i18n/locales';

// Initial state with locale, default to the first supported locale (e.g., 'en')
const initialState = {
    currentLocale: (typeof window !== 'undefined' && localStorage.getItem('locale')) as TLocale || SUPPORTED_LOCALES[0],
};

// Locale reducer
export const localeReducer = (state = initialState, action) => {
    switch (action.type) {
        case LocaleActionTypes.SET_LOCALE:
            return {
                ...state,
                currentLocale: action.payload,
            };

        default:
            return state;
    }
};
