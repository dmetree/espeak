import { ModalActionTypes } from "store/actionTypes";

const initialState = {
  openModals: [],
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case ModalActionTypes.PUSH_MODAL:
      return {
        ...state,
        openModals: [...state.openModals, action.payload],
      };

    case ModalActionTypes.REMOVE_MODAL:
      return {
        ...state,
        openModals: state.openModals.filter(
          (modal) => modal !== action.payload
        ),
      };

    case ModalActionTypes.POP_MODAL:
      return {
        ...state,
        openModals: state.openModals.slice(0, -1),
      };

    case ModalActionTypes.CLEAR_STACK:
      return {
        ...state,
        openModals: [],
      };

    case ModalActionTypes.SHOW_MODAL:
      return {
        ...state,
        openModals: state.openModals.includes(action.payload)
          ? state.openModals
          : [...state.openModals, action.payload],
      };

    case ModalActionTypes.HIDE_MODAL:
      return {
        ...state,
        openModals: state.openModals.filter(
          (modal) => modal !== action.payload
        ),
      };

    case ModalActionTypes.TOGGLE_MODAL:
      return state.openModals.includes(action.payload)
        ? {
            ...state,
            openModals: state.openModals.filter(
              (modal) => modal !== action.payload
            ),
          }
        : {
            ...state,
            openModals: [...state.openModals, action.payload],
          };

    default:
      return state;
  }
};
