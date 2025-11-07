import * as actionTypes from "../../actionTypes";

const initialState = {
  loading: false,
  specialistList: [],
  selectedSpecialist: null,
  list: [],
  random: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FIND_SPECIALISTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FIND_SPECIALISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        specialistList: action.payload,
      };
    case actionTypes.CLEAR_SPECIALIST_LIST:
      return {
        ...state,
        loading: false,
        specialistList: [],
      };
    case actionTypes.FIND_SPECIALISTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.SET_SELECTED_SPECIALIST:
      return {
        ...state,
        selectedSpecialist: action.payload,
      };

    case actionTypes.FIND_SPECIALISTS_BY_NICK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.FIND_SPECIALISTS_BY_NICK_SUCCESS:
      return {
        ...state,
        loading: false,
        specialistList: action.payload,
      };

    case actionTypes.FIND_SPECIALISTS_BY_NICK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.SET_SELECTED_BY_NICK_SPECIALIST:
      return {
        ...state,
        selectedSpecialist: action.payload,
      };
    case actionTypes.FIND_RANDOM_SPECIALISTS_REQUEST:
      return { ...state, loading: true, error: null };

    case actionTypes.FIND_RANDOM_SPECIALISTS_SUCCESS:
      return { ...state, loading: false, specialistList: action.payload };

    case actionTypes.FIND_RANDOM_SPECIALISTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default reducer;
