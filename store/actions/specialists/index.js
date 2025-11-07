import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import { EUserRole } from "@/components/shared/types";
import * as actionTypes from "@/store/actionTypes";
import { extractFromCollection } from "@/components/shared/utils/firebase/fs-collection/extracter";

export const findSpecialists = (value) => async (dispatch) => {
  dispatch({ type: actionTypes.FIND_SPECIALISTS_REQUEST });

  try {
    const searchValue = value?.toLowerCase();
    const specsCol = collection(database, "users");

    const baseQuery = query(
      specsCol,
      where("userRole", "==", EUserRole.Specialist)
    );

    const baseQuerySnapshot = await getDocs(baseQuery);
    let specialistList = extractFromCollection(baseQuerySnapshot);

    if (searchValue) {
      specialistList = specialistList.filter(
        (specialist) =>
          specialist.nickname?.toLowerCase().startsWith(searchValue) ||
          specialist.uid === searchValue
      );
    }

    dispatch({
      type: actionTypes.FIND_SPECIALISTS_SUCCESS,
      payload: specialistList,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FIND_SPECIALISTS_FAILURE,
      payload: error.message,
    });
  }
};

export const setSelectedSpecialist = (specialist) => ({
  type: actionTypes.SET_SELECTED_SPECIALIST,
  payload: specialist,
});

export const getSelectedSpecialistByNickname =
  (nickname) => async (dispatch) => {
    dispatch({ type: actionTypes.FIND_SPECIALISTS_BY_NICK_REQUEST });

    try {
      const specsCol = collection(database, "users");
      const specialistQuery = query(
        specsCol,
        where("nickname", "==", nickname)
      );
      const querySnapshot = await getDocs(specialistQuery);

      const specialist = extractFromCollection(querySnapshot)[0]; // Extract first result

      if (specialist) {
        dispatch({
          type: actionTypes.SET_SELECTED_BY_NICK_SPECIALIST,
          payload: specialist,
        });
      } else {
        dispatch({
          type: actionTypes.FIND_SPECIALISTS_BY_NICK_FAILURE,
          payload: "Specialist not found",
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FIND_SPECIALISTS_BY_NICK_FAILURE,
        payload: error.message,
      });
    }
  };

export const clearSpecialists = () => ({
  type: actionTypes.CLEAR_SPECIALIST_LIST,
  payload: [],
});

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const findRandomSpecialists = (userId) => async (dispatch) => {
  dispatch({ type: actionTypes.FIND_RANDOM_SPECIALISTS_REQUEST });

  try {
    /* 1 ─ single‑filter query */
    const snap = await getDocs(
      query(
        collection(database, "users"),
        where("userRole", "==", EUserRole.Specialist)
      )
    );

    /* 2 ─ convert → array */
    let specialists = extractFromCollection(snap);

    /* 3 ─ client‑side filter: keep if isAlive === true OR field missing */
    specialists = specialists.filter(
      (s) => s.isAlive !== false && s.uid !== userId
    );

    /* 4 ─ shuffle and take 10 */
    const randomTen = shuffle(specialists).slice(0, 10);

    dispatch({
      type: actionTypes.FIND_RANDOM_SPECIALISTS_SUCCESS,
      payload: randomTen,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FIND_RANDOM_SPECIALISTS_FAILURE,
      payload: error.message,
    });
  }
};
