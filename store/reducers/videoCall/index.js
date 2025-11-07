import * as actionTypes from "../../actionTypes";

const initState = {
  showVideoCall: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_VIDEO_CALL:
      return { ...state, showVideoCall: true };
    case actionTypes.HIDE_VIDEO_CALL:
      return { ...state, showVideoCall: false };
    default:
      return state;
  }
};

export default reducer;
