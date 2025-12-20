import { configureStore, combineReducers } from "@reduxjs/toolkit";

import blockchainReducer from "./reducers/blockchain/blockchain";
import networkCardanoReducer from "./reducers/networkCardano";
import networkErgoReducer from "./reducers/networkErgo";
import userReducer from "./reducers/profile/user";
import appointmentsReducer from "./reducers/appointments";
import videoReducer from "./reducers/videoCall";
import specialistsReducer from "./reducers/specialists";
import jobApplicationsReducer from "./reducers/jobApplications";
import postsReducer from "./reducers/posts";
import eventsReducer from "./reducers/events_reducers";
import complaintsReducer from "./reducers/complaints_check";
import { modalReducer } from "./reducers/modal";
import { localeReducer } from "./reducers/locale";

const rootReducer = combineReducers({
  modal: modalReducer,
  locale: localeReducer,
  blockchain: blockchainReducer,
  networkCardano: networkCardanoReducer,
  networkErgo: networkErgoReducer,
  user: userReducer,
  appointments: appointmentsReducer,
  video: videoReducer,
  specialists: specialistsReducer,
  jobApplications: jobApplicationsReducer,
  posts: postsReducer,
  complaints: complaintsReducer,
  events: eventsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// ✅ Typed hooks & types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
