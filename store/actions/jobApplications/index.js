import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import * as actionTypes from "../../actionTypes";

// Action to toggle loading state
export const toggleLoading = () => ({
  type: actionTypes.TOGGLE_LOADING,
});

// Action to fetch job applications
export const fetchJobApplications = () => async (dispatch) => {
  dispatch(toggleLoading());

  try {
    // Correct Firestore query
    const applicationsRef = collection(database, "applications");
    const querySnapshot = await getDocs(applicationsRef);

    const applications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: actionTypes.FETCH_JOB_APPLICATIONS,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error.message);

    dispatch({
      type: actionTypes.FETCH_JOB_APPLICATIONS_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading());
  }
};

export const setSelectedJobApplication = (jobApplication) => ({
  type: actionTypes.SET_SELECTED_JOB_APPLICATION,
  payload: jobApplication,
});

export const actionUpdateApplication =
  (status, applicationId) => async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_JOB_APPLICATION_REQUEST });

    try {
      const applicationRef = doc(database, "applications", applicationId);

      // Update the status field
      await updateDoc(applicationRef, { status });

      dispatch({
        type: actionTypes.UPDATE_JOB_APPLICATION_SUCCESS,
        payload: { applicationId, status },
      });
    } catch (error) {
      console.error("Error updating application status:", error.message);

      dispatch({
        type: actionTypes.UPDATE_JOB_APPLICATION_FAILURE,
        error: error.message,
      });
    }
  };
