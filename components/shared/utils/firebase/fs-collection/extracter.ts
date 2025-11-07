import { QuerySnapshot, DocumentSnapshot } from "firebase/firestore";

export const extractFromCollection = <T>(querySnap: QuerySnapshot<T>): T[] => {
  if (!querySnap?.docs) return [];
  return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const extractFirstFromQuery = <T>(query: QuerySnapshot<T>): T | null => {
  const doc = query.docs[0];
  return doc ? (doc.data() as T) : null;
};

export const extractSingleDoc = <T>(doc: DocumentSnapshot<T>): T | null => {
  return doc.exists() ? (doc.data() as T) : null;
};
