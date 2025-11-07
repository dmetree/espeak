import * as actionTypes from "../../actionTypes";

const initState = {
  complaint: null,
  complaintsList: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COMPLAINTS:
      return {
        ...state,
        complaintsList: action.data,
      };

    default:
      return state;
  }
};

export default reducer;
