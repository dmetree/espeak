// store/reducers/eventsReducer.js
import { showEventRoom } from "@/store/actions/events_actions";
import * as actionTypes from "../../actionTypes";

const initialState = {
  eventsList: [], // ✅ renamed from items
  selectedEvent: "",
  myEvents: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
  showEventRoom: false,
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_REQUEST:
      return { ...state, status: "loading" };

    case actionTypes.FETCH_EVENTS_SUCCESS:
      return { ...state, status: "succeeded", eventsList: action.payload };

    case actionTypes.FETCH_EVENTS_FAILURE:
      return { ...state, status: "failed", error: action.payload };

    case actionTypes.SET_SELECTED_EVENT:
      return { ...state, selectedEvent: action.payload };

    case actionTypes.ADD_EVENT_PARTICIPANT:
      return {
        ...state,
        selectedEvent:
          state.selectedEvent &&
          state.selectedEvent.id === action.payload.eventId
            ? {
                ...state.selectedEvent,
                participants: [
                  ...(state.selectedEvent.participants || []),
                  action.payload.user,
                ],
              }
            : state.selectedEvent,
        eventsList: state.eventsList.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                participants: [
                  ...(event.participants || []),
                  action.payload.user,
                ],
              }
            : event
        ),
      };

    case actionTypes.REMOVE_EVENT_PARTICIPANT: {
      const { eventId, userUid } = action.payload;

      return {
        ...state,
        eventsList: state.eventsList.map((event) =>
          event.id === eventId
            ? {
                ...event,
                students: event.students.filter((s) => s.uid !== userUid),
              }
            : event
        ),
        myEvents: state.myEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                students: event.students.filter((s) => s.uid !== userUid),
              }
            : event
        ),
      };
    }
    case actionTypes.DELETE_EVENT_SUCCESS:
      return {
        ...state,
        eventsList: state.eventsList.filter(
          (event) => event.id !== action.payload
        ),
        myEvents: state.myEvents.filter((event) => event.id !== action.payload),
      };

    case actionTypes.FETCH_MY_EVENTS_REQUEST:
      return { ...state, status: "loading" };

    case actionTypes.FETCH_MY_EVENTS_SUCCESS:
      return { ...state, status: "succeeded", myEvents: action.payload };

    case actionTypes.FETCH_MY_EVENTS_FAILURE:
      return { ...state, status: "failed", error: action.payload };

    case actionTypes.FINISH_EVENT_SUCCESS:
      return {
        ...state,
        eventsList: state.eventsList.map((event) =>
          event.id === action.payload
            ? {
                ...event,
                status: "finished",
                finishedAt: new Date().toISOString(),
              }
            : event
        ),
      };
    default:
      return state;
  }
}
