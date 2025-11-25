import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  limit,
  DocumentData,
  increment,
} from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import * as actionTypes from "../../actionTypes";
import { Timestamp } from "firebase/firestore";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { EReqStatus } from "@/components/shared/types";

type Dispatch = ThunkDispatch<any, any, AnyAction>;

interface Appointment {
  id: string;
  [key: string]: any;
}

interface DraftAppointment {
  [key: string]: any;
}

interface Message {
  [key: string]: any;
}

type ErrorType = string | Error;

export const fetchVacantAppointmentsStart = () => ({
  type: actionTypes.FETCH_VACANT_APPOINTMENTS_START,
});

export const fetchVacantAppointmentsSuccess = (data: Appointment[]) => ({
  type: actionTypes.FETCH_VACANT_APPOINTMENTS_SUCCESS,
  data,
});

export const fetchVacantAppointmentsFail = (error: ErrorType) => ({
  type: actionTypes.FETCH_VACANT_APPOINTMENTS_FAIL,
  error,
});

export const fetchMyAppointmentsStart = () => ({
  type: actionTypes.FETCH_MY_APPOINTMENTS_START,
});

export const fetchMyAppointmentsSuccess = (data: Appointment[]) => ({
  type: actionTypes.FETCH_MY_APPOINTMENTS_SUCCESS,
  data,
});

export const fetchMyAppointmentsFail = (error: ErrorType) => ({
  type: actionTypes.FETCH_MY_APPOINTMENTS_FAIL,
  error,
});

export const fetchWorkAppointmentsStart = () => ({
  type: actionTypes.FETCH_WORK_APPOINTMENTS_START,
});

export const fetchWorkAppointmentsSuccess = (data: Appointment[]) => ({
  type: actionTypes.FETCH_WORK_APPOINTMENTS_SUCCESS,
  data,
});

export const fetchWorkAppointmentsFail = (error: ErrorType) => ({
  type: actionTypes.FETCH_WORK_APPOINTMENTS_FAIL,
  error,
});

export const fetchCustomerAppointmentsStart = () => ({
  type: actionTypes.FETCH_CUSTOMER_APPOINTMENTS_START,
});

export const fetchCustomerAppointmentsSuccess = (data: Appointment[]) => ({
  type: actionTypes.FETCH_CUSTOMER_APPOINTMENTS_SUCCESS,
  data,
});

export const fetchCustomerAppointmentsFail = (error: ErrorType) => ({
  type: actionTypes.FETCH_CUSTOMER_APPOINTMENTS_FAIL,
  error,
});

export const createAppointmentStart = () => ({
  type: actionTypes.CREATE_APPOINTMENT_START,
});

export const createAppointmentSuccess = () => ({
  type: actionTypes.CREATE_APPOINTMENT_SUCCESS,
});

export const createAppointmentFail = (error: ErrorType) => ({
  type: actionTypes.CREATE_APPOINTMENT_FAIL,
  error,
});

export const setIsAppointmentFinished = (isFinished: boolean) => ({
  type: actionTypes.SET_IS_APPOINTMENT_FINISHED,
  isFinished,
});

export const clearDraftAppointment = () => ({
  type: actionTypes.CLEAR_DRAFT_APPOINTMENT,
});

export const deleteRequestStart = () => ({
  type: actionTypes.DELETE_REQUEST_START,
});

export const deleteRequestSuccess = (reqID: string) => ({
  type: actionTypes.DELETE_REQUEST_SUCCESS,
  reqID,
});

export const deleteRequestFail = (error: ErrorType) => ({
  type: actionTypes.DELETE_REQUEST_FAIL,
  error,
});

export const acceptRequestStart = () => ({
  type: actionTypes.ACCEPT_REQUEST_START,
});

export const acceptRequestSuccess = (reqID: string) => ({
  type: actionTypes.ACCEPT_REQUEST_SUCCESS,
  reqID,
});

export const acceptRequestFail = (error: ErrorType) => ({
  type: actionTypes.ACCEPT_REQUEST_FAIL,
  error,
});

export const cancelAcceptStart = () => ({
  type: actionTypes.CANCEL_ACCEPT_START,
});

export const cancelAcceptSuccess = (reqID: string) => ({
  type: actionTypes.CANCEL_ACCEPT_SUCCESS,
  reqID,
});

export const cancelAcceptFail = (error: ErrorType) => ({
  type: actionTypes.CANCEL_ACCEPT_FAIL,
  error,
});

export const cleanRequestRoom = () => ({
  type: actionTypes.CLEAN_REQUEST_ROOM,
});

export const setRequestRoomId = (id: string) => ({
  type: actionTypes.SET_REQUEST_ROOM_ID,
  payload: id,
});

export const fetchVacantAppointments =
  (userUid: string, psyRank: string) => async (dispatch: Dispatch) => {
    dispatch(fetchVacantAppointmentsStart());

    try {
      const requestsRef = collection(database, "requests");
      const vacantAppointmentsQuery = query(
        requestsRef,
        where("specUid", "==", null),
        where("clientUid", "!=", userUid)
      );
      const querySnapshot = await getDocs(vacantAppointmentsQuery);

      const appointmentsData: Appointment[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(fetchVacantAppointmentsSuccess(appointmentsData));
    } catch (err) {
      dispatch(fetchVacantAppointmentsFail("Failed to load appointments."));
      console.error("Error fetching vacant appointments:", err);
    }
  };

export const fetchWorkAppointments =
  (userUid: string) => async (dispatch: Dispatch) => {
    dispatch(fetchWorkAppointmentsStart());

    try {
      const requestsRef = collection(database, "requests");
      const workAppointmentsQuery = query(
        requestsRef,
        where("specUid", "==", userUid),
        limit(50)
      );
      const querySnapshot = await getDocs(workAppointmentsQuery);

      const appointmentsData: Appointment[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(fetchWorkAppointmentsSuccess(appointmentsData));
    } catch (err) {
      dispatch(fetchWorkAppointmentsFail("Failed to load work appointments."));
      console.error("Error fetching work appointments:", err);
    }
  };

export const fetchCustomerAppointments =
  (userUid: string) => async (dispatch: Dispatch) => {
    dispatch(fetchCustomerAppointmentsStart());

    try {
      const requestsRef = collection(database, "requests");
      const customerAppointmentsQuery = query(
        requestsRef,
        where("clientUid", "==", userUid)
      );
      const querySnapshot = await getDocs(customerAppointmentsQuery);

      const appointmentsData: Appointment[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(fetchCustomerAppointmentsSuccess(appointmentsData));
    } catch (err) {
      dispatch(
        fetchCustomerAppointmentsFail("Failed to load customer appointments.")
      );
      console.error("Error fetching customer appointments:", err);
    }
  };

export const fetchMyAppointments =
  (userUid: string) => async (dispatch: Dispatch) => {
    dispatch(fetchMyAppointmentsStart());

    try {
      const requestsRef = collection(database, "requests");
      const clientQuery = query(requestsRef, where("clientUid", "==", userUid));
      const specQuery = query(requestsRef, where("specUid", "==", userUid));

      const [clientSnapshot, specSnapshot] = await Promise.all([
        getDocs(clientQuery),
        getDocs(specQuery),
      ]);

      const appointmentsData: Appointment[] = [
        ...clientSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...specSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      dispatch(fetchMyAppointmentsSuccess(appointmentsData));
    } catch (err) {
      dispatch(fetchMyAppointmentsFail("Failed to load appointments."));
      console.error("Error fetching appointments:", err);
    }
  };

export const setDraftAppointment = (data: Partial<DraftAppointment>) => {
  return (dispatch: Dispatch, getState: () => any) => {
    const { draftAppointment } = getState().appointments;

    const updatedDraft = {
      ...draftAppointment,
      ...data,
    };

    dispatch({
      type: actionTypes.SET_DRAFT_APPOINTMENT,
      data: updatedDraft,
    });
  };
};

export const createAppointment =
  (
    userUid: string,
    draftAppointment: DraftAppointment,
    singletonId?: string,
    txId?: any,
    partnerOne?: string,
    partnerTwo?: string
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(createAppointmentStart());

    if (!userUid) {
      const error = new Error("Cannot create appointment: no user ID.");
      dispatch(createAppointmentFail(error));
      return Promise.reject(error);
    }

    if (!draftAppointment) {
      const error = new Error(
        "Cannot create appointment: no draft appointment."
      );
      dispatch(createAppointmentFail(error));
      return Promise.reject(error);
    }

    // console.log("One: ", partnerOne, "Two: ", partnerTwo);

    const rawAppointment = {
      ...draftAppointment,
      singletonId,
      txId,
      partnerOne,
      partnerTwo,
    };

    // Remove any undefined fields (e.g. singletonId/txId when blockchain flow is disabled)
    const appointment = Object.fromEntries(
      Object.entries(rawAppointment).filter(([, value]) => value !== undefined)
    );

    console.log("appointment", appointment);

    try {
      const requestsRef = collection(database, "requests");
      const docRef = await addDoc(requestsRef, appointment);

      console.log("docRef", docRef);

      dispatch(createAppointmentSuccess());
      dispatch(fetchMyAppointments(userUid));

      return docRef.id;
    } catch (error) {
      console.error("Error booking session:", error);
      dispatch(createAppointmentFail(error));
    } finally {
      dispatch(setIsAppointmentFinished(true));
    }
  };

export const deleteRequest =
  (userUid: string, reqID: string) => async (dispatch: Dispatch) => {
    dispatch(deleteRequestStart());
    try {
      await deleteDoc(doc(database, "requests", reqID));
      dispatch(deleteRequestSuccess(reqID));
      await new Promise((resolve) => setTimeout(resolve, 500));
      await dispatch(fetchMyAppointments(userUid));
    } catch (error) {
      console.error("Error deleting document: ", error);
      dispatch(deleteRequestFail(error));
    }
  };

export const acceptRequest =
  (
    uID: string,
    reqID: string,
    nickname: string,
    specAvatar: string,
    psyRank: string
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(acceptRequestStart());

    try {
      await updateDoc(doc(database, "requests", reqID), {
        status: EReqStatus.Accepted,
        specUid: uID,
        specNickname: nickname,
        specAvatar: specAvatar,
      });
      dispatch(acceptRequestSuccess(reqID));
      dispatch(fetchVacantAppointments(uID, psyRank));
    } catch (error) {
      console.error("Error updating document: ", error);
      dispatch(acceptRequestFail(error));
    }
  };

export const cancelAccept =
  (userUid: string, reqID: string) => async (dispatch: Dispatch) => {
    dispatch(cancelAcceptStart());
    try {
      await updateDoc(doc(database, "requests", reqID), {
        status: EReqStatus.Open,
        specUid: null,
      });
      dispatch(cancelAcceptSuccess(reqID));
      dispatch(fetchMyAppointments(userUid));
    } catch (error) {
      console.error("Error updating document: ", error);
      dispatch(cancelAcceptFail(error));
    }
  };

export const clientSubmitComplaint =
  (reqId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.CLIENT_COMPLAINT_START });
    try {
      await updateDoc(doc(database, "requests", reqId), {
        complaintFromClient: true,
      });
      dispatch({ type: actionTypes.CLIENT_COMPLAINT_SUCCESS, payload: reqId });
    } catch (error) {
      console.error("Error submitting complaint: ", error);
      dispatch({ type: actionTypes.CLIENT_COMPLAINT_FAIL, payload: error });
    }
  };

export const fetchComplaintRequests = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_COMPLAINT_REQUESTS_START });

  try {
    const q = query(
      collection(database, "requests"),
      where("complaintFromClient", "==", true)
    );

    const querySnapshot = await getDocs(q);

    const complaintRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: actionTypes.FETCH_COMPLAINT_REQUESTS_SUCCESS,
      payload: complaintRequests,
    });
  } catch (error) {
    console.error("Error fetching complaint requests: ", error);
    dispatch({
      type: actionTypes.FETCH_COMPLAINT_REQUESTS_FAIL,
      payload: error,
    });
  }
};

const getRequestRoom = async (reqId: string): Promise<DocumentData | null> => {
  const docRef = doc(database, "requests", reqId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("No such document!");
    return null;
  }
};

export const setRequestRoom = (reqId: string) => async (dispatch: Dispatch) => {
  try {
    const room = await getRequestRoom(reqId);
    dispatch({
      type: actionTypes.SET_REQUEST_ROOM,
      payload: room,
    });
  } catch (error) {
    console.error("Failed to fetch request room:", error);
  }
};

export const listenToRequestRoom = (reqId: string) => (dispatch: Dispatch) => {
  try {
    const docRef = doc(database, "requests", reqId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();

        const normalizedMessages: Message[] =
          roomData.messages
            ?.map((message: any) => ({
              ...message,
              timestamp:
                typeof message.timestamp?.toMillis === "function"
                  ? message.timestamp.toMillis()
                  : message.timestamp,
            }))
            .filter((msg: any) => typeof msg.timestamp === "number") || [];

        dispatch({
          type: actionTypes.SET_REQUEST_ROOM,
          payload: { ...roomData, messages: normalizedMessages },
        });
      } else {
        console.error("Request room does not exist.");
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up Firestore listener:", error);
  }
};

export const sendMessage =
  (reqId: string, message: Message) => async (dispatch: Dispatch) => {
    try {
      const reqDocRef = doc(database, "requests", reqId);

      await updateDoc(reqDocRef, {
        messages: arrayUnion(message),
      });

      dispatch({
        type: actionTypes.SEND_MESSAGE_SUCCESS,
        payload: message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch({
        type: actionTypes.SEND_MESSAGE_FAILURE,
        error,
      });
    }
  };

export const confirmAppointmentOnChain =
  (docId: string) => async (dispatch) => {
    try {
      await updateDoc(doc(database, "requests", docId), {
        confirmedOnChain: true,
      });

      dispatch({
        type: actionTypes.CONFIRM_APPOINTMENT_ON_CHAIN,
        payload: docId,
      });
    } catch (error) {
      console.error("Error confirming on-chain:", error);
    }
  };

export const deleteAcceptedReqPsych = // in case of cancelAccept and in case of Success cancelAcceptPsych
  (psychUserUid: string, requestId: string) => async (dispatch) => {
    try {
      const requestRef = doc(database, "requests", requestId);
      const docSnap = await getDoc(requestRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.specUid === psychUserUid) {
          await deleteDoc(requestRef);
          dispatch({
            type: actionTypes.CANCEL_ACCEPT_PSYCHE, // Optional: Add an action type if needed
            payload: requestId,
          });
        } else {
          console.warn("SpecUid does not match. Not authorized to delete.");
        }
      } else {
        console.warn("Request not found.");
      }
    } catch (error) {
      console.error("Error cancelling accepted session as psych:", error);
    }
  };

export const incrementHrPsy = (psychUserUid: string) => async (dispatch) => {
  try {
    const psychRef = doc(database, "users", psychUserUid);
    await updateDoc(psychRef, { hrPsy: increment(1) });

    dispatch({
      type: actionTypes.INCREMENT_HR_PSY,
      payload: { psychUserUid },
    });
  } catch (error) {
    console.error("Error updating psychologist hours:", error);
  }
};

export const incrementHrInPsy = (clientUid: string) => async (dispatch) => {
  try {
    const clientRef = doc(database, "users", clientUid);
    await updateDoc(clientRef, { hrInPsy: increment(1) });

    dispatch({
      type: actionTypes.INCREMENT_HR_IN_PSY,
      payload: { clientUid },
    });
  } catch (error) {
    console.error("Error updating client hours:", error);
  }
};

export const psychDeleteRequestClaimRewards =
  (userUid: string, reqID: string) => async (dispatch: Dispatch) => {
    dispatch(deleteRequestStart());
    try {
      await deleteDoc(doc(database, "requests", reqID));
      dispatch(deleteRequestSuccess(reqID));
    } catch (error) {
      console.error("Error deleting document: ", error);
      dispatch(deleteRequestFail(error));
    }
  };
