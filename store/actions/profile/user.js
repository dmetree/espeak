import * as actionTypes from "@/store/actionTypes";
import { auth } from "@/components/shared/utils/firebase/init";

import { IJobRequestStatus } from "@/components/shared/types";
import { signOut } from "firebase/auth";
import { EUserRole } from "@/components/shared/types";
import "firebase/firestore";
import firebase from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

import {
  setDoc,
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import { getCurrentTimeZone } from "@/components/shared/utils/datetime/get-current-timezone";

export const login = (email, password) => {
  return (dispatch) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { uid, email } = userCredential.user;

        localStorage.setItem("userUid", uid); // saving to local storage
        localStorage.setItem("userEmail", email); // saving to local storage
        dispatch({ type: actionTypes.LOGIN, data: { uid, email } });
      })
      .catch((error) => {
        console.error("Login error:", error);
        throw error;
      });
  };
};

export const fetchUserData = (uid) => {
  return async (dispatch) => {
    try {
      // Reference the user document in Firestore
      const userRef = doc(database, "users", uid);
      const userDoc = await getDoc(userRef);

      // Check if the document exists and has data
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Dispatch an action with the retrieved user data
        dispatch({ type: actionTypes.FETCH_USER_DATA, data: userData });
      } else {
        console.log("No user data found.");
        // dispatch({
        //   type: actionTypes.FETCH_USER_DATA_FAILURE,
        //   error: "No user data found.",
        // });
      }
    } catch (error) {
      // console.error("Error fetching user data:", error);
      // dispatch({ type: actionTypes.FETCH_USER_DATA_FAILURE, error });
    }
  };
};

export const getUserById = (userId) => {
  return async (dispatch) => {
    try {
      // Reference the user document in Firestore
      const userRef = doc(database, "users", userId);
      const userDoc = await getDoc(userRef);

      // Check if the document exists and has data
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Dispatch an action to set applicantUserData
        dispatch({
          type: actionTypes.SET_APPLICANT_USER_DATA,
          data: userData,
        });
      } else {
        console.log("No user data found.");
        // You might handle errors or missing data as needed
        dispatch({
          type: actionTypes.SET_APPLICANT_USER_DATA,
          data: null,
        });
      }
    } catch (error) {
      console.error("Error fetching applicant user data:", error);
      // Optionally handle errors here, such as dispatching an error action
    }
  };
};

// check if user is loggedIn and data is saved in local storage
export const loadUserFromLocalStorage = () => {
  const uid = localStorage.getItem("userUid");
  const email = localStorage.getItem("userEmail");

  if (uid && email) {
    return {
      type: actionTypes.LOAD_USER_FROM_STORAGE,
      data: { uid, email },
    };
  } else {
    return { type: actionTypes.LOGOUT };
  }
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await signOut(auth);

      // Clear localStorage
      localStorage.removeItem("userUid");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userData");
      localStorage.clear(); // clear all if needed

      // Optional: clear sessionStorage too
      sessionStorage.clear();

      // Force cache invalidation (e.g., Firebase persistence)
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }

      dispatch({ type: actionTypes.LOGOUT });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };
};

// TODO: Update with Redux
export const resetPassword = (email) => {
  return (dispatch) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        dispatch({ type: actionTypes.RESET_PASSWORD });
      })
      .catch((error) => {
        console.error("Reset password error:", error);
        throw error;
      });
  };
};

// TODO: Update with Redux and FB_v9
export const signup = (
  email,
  password,
  nickname,
  partnerOne,
  partnerTwo,
  selectedlanguage
) => {
  return async (dispatch) => {
    const auth = getAuth(); // Initialize Firebase Auth
    const firestore = getFirestore(); // Initialize Firestore

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Prepare user profile data
      const userProfile = {
        uid: user.uid,
        email: email,
        nickname: nickname.toLowerCase(),
        avatar: "",
        firstVisit: true,
        languages: [selectedlanguage],
        myTeachers: [],
        myNovices: [],
        gender: 0,
        timeZone: getCurrentTimeZone(),
        userRole: EUserRole.Novice,
        hrEducation: 0,
        inProfessionSince: 0,
        wasLate: 0,
        isAlive: true,
        jobRequest: IJobRequestStatus.None,
        yearOfBirth: 0,
        yearOfDeath: 0,
        partnerOne: partnerOne,
        partnerTwo: partnerTwo,
        created_at: Timestamp.now(),
      };

      // Save user profile to Firestore
      await setDoc(doc(firestore, "users", user.uid), userProfile);

      // Dispatch Redux action for signup
      dispatch({ type: actionTypes.SIGNUP, data: user });

      localStorage.setItem("userUid", userProfile.uid); // saving to local storage
      localStorage.setItem("userEmail", userProfile.email); // saving to local storage

      console.log("User created and profile saved successfully.");
    } catch (error) {
      console.error("Error during signup process:", error);
      throw error; // Rethrow error for higher-level handling
    }
  };
};

export const googleSignup = (
  user,
  partnerOne,
  partnerTwo,
  selectedlanguage
) => {
  return async (dispatch) => {
    const firestore = getFirestore();
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // User does not exist, create a new profile
      const userProfile = {
        uid: user?.uid,
        email: user?.email,
        nickname: user?.displayName ? user.displayName.toLowerCase() : "",
        avatar: user?.photoURL || "",
        firstVisit: true,
        languages: [selectedlanguage],
        myTeachers: [],
        myNovices: [],
        gender: 0,
        timeZone: getCurrentTimeZone(),
        userRole: EUserRole.Novice,
        hrEducation: 0,
        inProfessionSince: 0,
        wasLate: 0,
        isAlive: true,
        jobRequest: IJobRequestStatus.None,
        yearOfBirth: 0,
        yearOfDeath: 0,
        partnerOne: partnerOne,
        partnerTwo: partnerTwo,
        created_at: Timestamp.now(),
      };

      // Save user profile to Firestore
      await setDoc(userRef, userProfile);
    }

    // Dispatch Redux action
    dispatch({ type: actionTypes.SIGNUP, data: user });

    // Save to local storage
    localStorage.setItem("userUid", user?.uid);
    localStorage.setItem("userEmail", user?.email);
  };
};

export const saveSlotsRequest = () => ({
  type: actionTypes.SAVE_SLOTS_REQUEST,
});

export const saveSlotsSuccess = () => ({
  type: actionTypes.SAVE_SLOTS_SUCCESS,
});

export const saveSlotsFailure = (error) => ({
  type: actionTypes.SAVE_SLOTS_FAILURE,
  payload: error,
});

// Thunk Action
export const saveSlots = (uID, freeTimestamps) => {
  return async (dispatch) => {
    dispatch(saveSlotsRequest());

    try {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", uID); // Modular syntax for Firestore v9+

      // Update the user's freeTimestamps field
      await updateDoc(userDocRef, { freeTimestamps });

      dispatch(saveSlotsSuccess());
    } catch (error) {
      console.error("Error updating slots:", error);
      dispatch(saveSlotsFailure("Failed to save slots."));
    }
  };
};

export const actionUpdateProfile = (updatedData, userId, fieldPath = null) => {
  return async (dispatch) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, "users", userId);

      let dataToUpdate;

      if (fieldPath) {
        // ✅ update nested field like userData.notifications
        dataToUpdate = { [fieldPath]: updatedData };
      } else {
        // ✅ default: merge provided object into user doc
        dataToUpdate = updatedData;
      }

      await updateDoc(userRef, dataToUpdate);

      const updatedUserDoc = await getDoc(userRef);
      const updatedUserData = updatedUserDoc.exists()
        ? updatedUserDoc.data()
        : null;

      dispatch({
        type: actionTypes.UPDATE_USER_PROFILE,
        data: updatedUserData,
      });

      return "Profile updated successfully!";
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
};

export const actionCreateUser = (userData) => {
  return async (dispatch) => {
    try {
      // Reference to the "users" collection in Firestore
      const usersCollectionRef = collection(database, "users");

      // Create a new user document in the collection
      const docRef = await addDoc(usersCollectionRef, {
        ...userData,
        createdAt: new Date().toISOString(),
      });

      // Dispatch the new user data with the generated ID
      dispatch({
        type: actionTypes.CREATE_NEW_USER,
        data: { id: docRef.id, ...userData },
      });

      console.log("New user created successfully with ID:", docRef.id);
      return `New user created successfully with ID: ${docRef.id}`;
    } catch (error) {
      console.error("Error creating new user:", error);
      throw error;
    }
  };
};

export const deleteUserProfile = (userId) => {
  // TODO: check if there're appointments with this userId. If so, ask to close them first.

  return async (dispatch) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(database, "users", userId);

      // Delete Firestore user document
      await deleteDoc(userRef);

      // If the user is currently signed in, delete from authentication
      if (user && user.uid === userId) {
        await deleteUser(user);
        auth.signOut(); // Ensure the user is logged out
      }

      // Clear local storage
      localStorage.removeItem("userUid");
      localStorage.removeItem("userEmail");

      // Dispatch Redux action
      dispatch({ type: actionTypes.DELETE_USER_PROFILE });

      console.log("User profile deleted successfully.");
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  };
};
