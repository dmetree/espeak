import {
  LESSON_REQUEST_TX_START,
  LESSON_REQUEST_TX_SUCCESS,
  LESSON_REQUEST_TX_FAIL,
} from "@/store/actionTypes";

const initialState = {
  loading: false,
  error: null,
  txHash: null,
};

const lessonRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case LESSON_REQUEST_TX_START:
      return {
        ...state,
        loading: true,
        error: null,
        txHash: null,
      };

    case LESSON_REQUEST_TX_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        txHash: action.payload.txHash,
      };

    case LESSON_REQUEST_TX_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error || "Unknown error",
      };

    default:
      return state;
  }
};

export default lessonRequestReducer;
