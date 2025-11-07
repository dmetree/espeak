// import firebase from "firebase/app";

// type FirestoreDataConverter<T extends firebase.firestore.DocumentData> = {
//   toFirestore: (data: T) => T;
//   fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => T;
// };

// export const getCastedConverter = <
//   T extends firebase.firestore.DocumentData
// >(): FirestoreDataConverter<T> => {
//   return {
//     toFirestore: (data: T) => data,
//     fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) =>
//       snap.data() as T,
//   };
// };
