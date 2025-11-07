// interface IMHUserProfile extends ISpecProfile {
//   posts: IPost[];
//   methodCreator: string[]; // only for psy

//   psyMethods: string[]; // eng shortnames
//   // methods: string[];

//   psySpecialities: string[]; // only for psy
//   // specialities: string[];

//   myTeachers: string[]; // uuids of specialists
//   myNovices: string[]; // uids of novices

//   hrInPsy: number; // hours in psychotherapy as specialist
//   hrPsy: number; // hours of own psychotherapy
//   hrEducation: number; // hours of education
//   inProfessionSince: number; // @TODO: check fb schema // since what year is in profession

//   isAlive: boolean; // only for psy
//   yearOfBirth: number;
//   yearOfDeath: number;
// }

// interface IMHApplication {
//   uid: string;
//   diploma: string;
//   certificates: string[];
//   myTherapists: TeacherTherapist[];
//   extra_info: string;
// }

// interface TeacherTherapist {
//   name: string;
//   profileLink: string;
//   from: string;
//   to: string;
//   sessions: number;
// }

// interface IPost {
//   uid: string;
//   url: string;
//   content: string;
//   reviewsRequested: number;
//   reward: number;
//   rewardTokenId: string;
//   comments: PostComment[];
//   likes: number;
// }

// interface PostComment {
//   uid: string;
//   creatorId: string;
//   creatorRank: string;
//   creatorProfile: string;
//   content: string;
//   likes: number;
// }

// /**
//  * Creates a reference to a Firestore collection with a specific result casting converter.
//  * @template T The type of data to convert.
//  * @param {ECollection} collection The name of the FS collection.
//  * @returns The collection reference.
//  */
// const getFSCollections = <T extends firebase.firestore.DocumentData>(
//   collection: FS.EMHCollection | FS.EESCollection
// ) =>
//   firebase
//     .firestore()
//     .collection(collection)
//     .withConverter(getCastedConverter<T>());

// /**
//  * Namespace for Firestore collection interactions with type casting.
//  */
// // eslint-disable-next-line @typescript-eslint/no-namespace
// export namespace FS {
//   export enum EMHCollection {
//     Users = "users",
//     Requests = "requests",
//     Applications = "applications",
//     Articles = "articles",
//     AnswerCandidates = "answerCandidates",
//     OfferCandidates = "offerCandidates",
//     Calls = "calls",
//   }
//   export enum EESCollection {
//     Users = "users",
//     Requests = "requests",
//     AnswerCandidates = "answerCandidates",
//     OfferCandidates = "offerCandidates",
//     Calls = "calls",
//   }
//   /**
//    * Contains references to known Firestore collections, **always** use this.
//    *
//    * _Sometimes it's better for you to use original FS methods, but only referring
//    * to collection from this object._
//    */
//   export const collections = {
//     // MindHealer
//     MHUsers: getFSCollections<IMHUserProfile>(FS.EMHCollection.Users),
//     MHRequests: getFSCollections<IAppointmentReq>(FS.EMHCollection.Requests),
//     MHApplictions: getFSCollections<IMHApplication>(
//       FS.EMHCollection.Applications
//     ),
//     MHArticles: getFSCollections<IMHArticle>(FS.EMHCollection.Articles),
//     // EasySpeak
//     Requests: getFSCollections<IAppointmentReq>(FS.EESCollection.Requests),
//     Users: getFSCollections<IUserProfile>(FS.EESCollection.Users),
//     Specialists: getFSCollections<ISpecProfile>(FS.EESCollection.Users),
//     Calls: getFSCollections<ICall>(FS.EESCollection.Calls),
//   };

//   export type TRequestsCollection = typeof collections.Requests;
//   export type TUsersCollection = typeof collections.Users;
//   export type TSpecialistsCollection = typeof collections.Specialists;
//   export type TMHApplications = typeof collections.MHApplictions;
//   export type TMHArticles = typeof collections.MHArticles;

//   /**
//    * Retrieves a document from a specific Firestore collection, optional method.
//    *
//    * **We need to provide both: type of data and collection...**
//    * @example getDoc<IUserProfile>(FS.EMHCollection.Users, "142")
//    * @template T The type of data in the document.
//    * @param {EMHCollection | EESCollection} collection The name of the collection.
//    * @param {string} docId The ID of the document.
//    * @returns {Promise<T | undefined>} A promise that resolves with the data from the document, or undefined if the document does not exist.
//    */
//   export const getDoc = async <T extends firebase.firestore.DocumentData>(
//     collection: EMHCollection | EESCollection,
//     docId: string
//   ): Promise<T | undefined> => {
//     const collectionRef = getFSCollections<T>(collection);
//     const docSnapshot = await collectionRef.doc(docId).get();
//     return docSnapshot.data();
//   };

//   /**
//    * Retrieves all documents from a specific Firestore collection, optional method.
//    *
//    * **We need to provide both: type of data and collection...**
//    * @example getAllDocs<IUserProfile>(FS.EMHCollection.Users)
//    * @template T The type of data in the documents.
//    * @param {EMHCollection | EESCollection} collection The name of the collection.
//    * @returns {Promise<T[]>} A promise that resolves with an array of the data from each document.
//    */
//   export const getAllDocs = async <T extends firebase.firestore.DocumentData>(
//     collection: EMHCollection | EESCollection
//   ): Promise<T[]> => {
//     const collectionRef = getFSCollections<T>(collection);
//     const querySnapshot = await collectionRef.get();
//     return querySnapshot.docs.map((doc) => doc.data());
//   };

//   /**
//    * Adds a new document to a specific Firestore collection, optional method.
//    *
//    * **We need to provide both: type of data and collection...**
//    * @example addDoc<IUserProfile>(FS.EMHCollection.Users, {})
//    * @template T The type of data to add to the document.
//    * @param {EMHCollection | EESCollection} collection The name of the collection.
//    * @param {T} data The data to add to the document.
//    * @returns {Promise<T>} A promise that resolves with the data from the new document.
//    */
//   export const addDoc = async <T extends firebase.firestore.DocumentData>(
//     collection: EMHCollection | EESCollection,
//     data: T
//   ): Promise<T> => {
//     return getFSCollections<T>(collection)
//       .add(data)
//       .then((d) => d.get())
//       .then((snapshot) => snapshot.data()!);
//   };
// }
