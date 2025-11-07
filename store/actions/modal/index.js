import { ModalActionTypes } from "store/actionTypes";

export const pushModal = (modalID) => ({
  type: ModalActionTypes.PUSH_MODAL,
  payload: modalID,
});

export const removeModal = (modalID) => ({
  type: ModalActionTypes.REMOVE_MODAL,
  payload: modalID,
});

export const popModal = () => ({
  type: ModalActionTypes.POP_MODAL,
});

export const clearModalStack = () => ({
  type: ModalActionTypes.CLEAR_STACK,
});

export const showModal = (modalID) => ({
  type: ModalActionTypes.SHOW_MODAL,
  payload: modalID,
});

export const hideModal = (modalID) => ({
  type: ModalActionTypes.HIDE_MODAL,
  payload: modalID,
});

export const toggleModal = (modalID) => ({
  type: ModalActionTypes.TOGGLE_MODAL,
  payload: modalID,
});
