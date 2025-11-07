import * as actionTypes from "../../actionTypes";

const initState = {
  uid: null,
  email: null,
  applicantUserData: null,
  resetPasswordSent: false,
  userData: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
    case actionTypes.LOGIN:
    case actionTypes.SIGNUP:
      return {
        ...state,
        uid: action.data.uid,
        email: action.data.email,
      };
    case actionTypes.LOAD_USER_FROM_STORAGE: // handle loading from storage
      return { ...state, ...action.data };
    case actionTypes.LOGOUT:
      return { ...state, uid: null, email: null };

    case actionTypes.RESET_PASSWORD:
      return { ...state, resetPasswordSent: true };
    case actionTypes.FETCH_USER_DATA:
      return { ...state, userData: action.data };
    case actionTypes.UPDATE_USER_PROFILE:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.data,
        },
      };
    case actionTypes.SET_APPLICANT_USER_DATA:
      return {
        ...state,
        applicantUserData: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
