import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";

import { EventStatus } from "@/components/shared/types/types";

import * as actionTypes from "../../actionTypes";

// Thunk Action
export const fetchEvents = () => async (dispatch) => {
  dispatch({ type: actionTypes.FETCH_EVENTS_REQUEST });
  try {
    const querySnapshot = await getDocs(collection(database, "events"));
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch({ type: actionTypes.FETCH_EVENTS_SUCCESS, payload: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    dispatch({ type: actionTypes.FETCH_EVENTS_FAILURE, payload: error });
  }
};

export const setSelectedEvent = (event) => ({
  type: actionTypes.SET_SELECTED_EVENT,
  payload: event,
});

export const fetchEventById = (id) => async (dispatch) => {
  try {
    const docRef = doc(database, "events", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      dispatch({
        type: actionTypes.SET_SELECTED_EVENT,
        payload: { id: docSnap.id, ...docSnap.data() },
      });
    } else {
      console.warn("No such event!");
    }
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

export const showEventRoom = () => ({
  type: actionTypes.SHOW_EVENT_ROOM,
});

export const hideEventRoom = () => ({
  type: actionTypes.HIDE_EVENT_ROOM,
});

export const addUserToEvent = (eventId, userDetails) => async (dispatch) => {
  try {
    const eventRef = doc(database, "events", eventId);

    const safeUserDetails = cleanObject(userDetails);

    await updateDoc(eventRef, {
      students: arrayUnion(safeUserDetails),
    });

    dispatch({
      type: actionTypes.ADD_EVENT_PARTICIPANT,
      payload: { eventId, user: safeUserDetails },
    });
  } catch (error) {
    console.error("Error adding student:", error);
  }
};

const cleanObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export const getMyEvents = (userUid) => async (dispatch) => {
  dispatch({ type: actionTypes.FETCH_MY_EVENTS_REQUEST });

  try {
    const snap = await getDocs(collection(database, "events"));
    const allEvents = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ filter by author OR student
    const myEvents = allEvents.filter(
      (event) =>
        event?.author?.uid === userUid ||
        (Array.isArray(event?.students) &&
          event.students.some((s) => s.uid === userUid))
    );

    dispatch({
      type: actionTypes.FETCH_MY_EVENTS_SUCCESS,
      payload: myEvents,
    });
  } catch (error) {
    console.error("Error fetching my events:", error);
    dispatch({
      type: actionTypes.FETCH_MY_EVENTS_FAILURE,
      payload: error.message,
    });
  }
};

export const removeUserFromEvent = (eventId, userUid) => async (dispatch) => {
  try {
    const eventRef = doc(database, "events", eventId);

    // ✅ Update Redux immediately (optimistic update)
    dispatch({
      type: actionTypes.REMOVE_EVENT_PARTICIPANT,
      payload: { eventId, userUid },
    });

    // Fetch current students from Firestore
    const eventSnapshot = await getDoc(eventRef);
    const eventData = eventSnapshot.data();

    if (!eventData?.students) return;

    // Remove the matching student by uid
    const updatedStudents = eventData.students.filter(
      (student) => student.uid !== userUid
    );

    // Update Firestore
    await updateDoc(eventRef, { students: updatedStudents });
  } catch (error) {
    console.error("Error removing student:", error);

    // ⚠️ Optional: rollback if Firestore fails
    dispatch({
      type: actionTypes.REMOVE_EVENT_PARTICIPANT_ROLLBACK,
      payload: { eventId, userUid },
    });
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  dispatch({ type: actionTypes.DELETE_EVENT_REQUEST, payload: eventId });

  try {
    const eventRef = doc(database, "events", eventId);

    // Delete from Firestore
    await deleteDoc(eventRef);

    // Update Redux state
    dispatch({
      type: actionTypes.DELETE_EVENT_SUCCESS,
      payload: eventId,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    dispatch({
      type: actionTypes.DELETE_EVENT_FAILURE,
      payload: { eventId, error: error.message },
    });
  }
};

export const finishEvent = (eventId) => async (dispatch) => {
  try {
    const eventRef = doc(database, "events", eventId);
    await updateDoc(eventRef, {
      status: EventStatus.Finished,
      finishedAt: new Date().toISOString(),
    });

    dispatch({
      type: actionTypes.FINISH_EVENT_SUCCESS,
      payload: eventId,
    });
  } catch (error) {
    console.error("Error finishing event:", error);
  }
};
