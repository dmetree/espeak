import * as actionTypes from "../../actionTypes";

import { format } from "date-fns";
import { EReqStatus, EGender } from "@/components/shared/types/types";

const initialState = {
  vacantAppointments: [],
  workAppointments: [],
  customerAppointments: [],
  myAppointments: [],
  isAppointmentFinished: false,

  draftAppointment: {
    format: "video-call",
    selectedService: null,
    subject: "other",
    selectedDate: format(new Date(), "dd LLLL yyyy"),
    selectedHour: 18,
    timeZone: null,
    psyRank: 3,
    price: 3000,
    // price: 10,
    gender: EGender.Unknown,
    age: "Not Important",
    nickname: "",
    lang: [],
    status: EReqStatus.Open,
    specUid: "",
  },
  requestRoomId: null,
  requestRoom: null,
  loading: false,
  error: null,

  // for admin
  complaintRequests: [],
};

const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_VACANT_APPOINTMENTS_START:
    case actionTypes.FETCH_WORK_APPOINTMENTS_START:
    case actionTypes.FETCH_CUSTOMER_APPOINTMENTS_START:
    case actionTypes.FETCH_MY_APPOINTMENTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.FETCH_VACANT_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        vacantAppointments: action.data,
      };

    case actionTypes.FETCH_WORK_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        workAppointments: action.data,
      };

    case actionTypes.FETCH_CUSTOMER_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        customerAppointments: action.data,
      };

    case actionTypes.FETCH_MY_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        myAppointments: action.data,
      };

    case actionTypes.FETCH_VACANT_APPOINTMENTS_FAIL:
    case actionTypes.FETCH_WORK_APPOINTMENTS_FAIL:
    case actionTypes.FETCH_CUSTOMER_APPOINTMENTS_FAIL:
    case actionTypes.FETCH_MY_APPOINTMENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case actionTypes.CREATE_APPOINTMENT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAppointmentFinished: true,
      };

    case actionTypes.CREATE_APPOINTMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.SET_IS_APPOINTMENT_FINISHED:
      return {
        ...state,
        isAppointmentFinished: action.isFinished,
      };

    case actionTypes.CLEAR_DRAFT_APPOINTMENT:
      return {
        ...state,
        draftAppointment: {
          format: "video-call",
          selectedService: null,
          subject: "other",
          selectedDate: format(new Date(), "dd LLLL yyyy"),
          selectedHour: 18,
          timeZone: null,
          psyRank: 3,
          // price: 10,
          price: 3000, // return to 500 after sc integration
          gender: EGender.Unknown,
          age: "Not Important",
          nickname: "",
          lang: [],
          status: EReqStatus.Open,
          specUid: "",
        },
      };

    case actionTypes.SET_DRAFT_APPOINTMENT:
      return {
        ...state,
        draftAppointment: action.data,
      };

    case actionTypes.DELETE_REQUEST_START:
    case actionTypes.ACCEPT_REQUEST_START:
    case actionTypes.CANCEL_ACCEPT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.DELETE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        vacantAppointments: state.vacantAppointments.filter(
          (appointment) => appointment.id !== action.reqID
        ),
      };

    case actionTypes.ACCEPT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case actionTypes.CANCEL_ACCEPT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case actionTypes.DELETE_REQUEST_FAIL:
    case actionTypes.ACCEPT_REQUEST_FAIL:
    case actionTypes.CANCEL_ACCEPT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case actionTypes.SET_REQUEST_ROOM_ID:
      return {
        ...state,
        requestRoomId: action.payload,
      };

    case actionTypes.SET_REQUEST_ROOM:
      return {
        ...state,
        requestRoom: action.payload,
      };

    case actionTypes.CLEAN_REQUEST_ROOM:
      return {
        ...state,
        requestRoom: null,
      };

    case actionTypes.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        requestRoom: {
          ...state.requestRoom,
          messages: [...(state.requestRoom?.messages || []), action.payload],
        },
      };
    case actionTypes.SEND_MESSAGE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case actionTypes.FETCH_COMPLAINT_REQUESTS_START:
      return { ...state, loading: true, error: null };
    case actionTypes.FETCH_COMPLAINT_REQUESTS_SUCCESS:
      return { ...state, loading: false, complaintRequests: action.payload };
    case actionTypes.FETCH_COMPLAINT_REQUESTS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default appointmentsReducer;
