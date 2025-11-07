import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  collection as firebaseCollection,
  addDoc as firebaseAddDoc,
} from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import * as actionTypes from "../../actionTypes";

export const showVideoCall = () => ({
  type: actionTypes.SHOW_VIDEO_CALL,
});

export const hideVideoCall = () => ({
  type: actionTypes.HIDE_VIDEO_CALL,
});
