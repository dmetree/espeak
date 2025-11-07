import * as actionTypes from "../../actionTypes";

const initState = {
  draftJobApplication: null,
  selectedJobApplication: null,
  jobApplicationsList: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_JOB_APPLICATIONS:
      return {
        ...state,
        jobApplicationsList: action.data,
      };

    case actionTypes.SET_SELECTED_JOB_APPLICATION:
      return {
        ...state,
        selectedJobApplication: action.payload,
      };

    case actionTypes.UPDATE_JOB_APPLICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case actionTypes.UPDATE_JOB_APPLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: state.applications.map((application) =>
          application.id === action.payload.applicationId
            ? { ...application, status: action.payload.status }
            : application
        ),
      };

    case actionTypes.UPDATE_JOB_APPLICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
