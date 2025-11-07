// import { FS } from '@common/shared/utils/firebase/fs-collection';
// import firebase from 'firebase';

// export class ChatService {
//   // _root: RootStore;

//   // constructor(root: RootStore) {
//   //   this._root = root;
//   // }

//   reqCol: FS.TRequestsCollection;

//   constructor(reqCol: FS.TRequestsCollection) {
//     this.reqCol = reqCol;
//   }

//   sendMessage = (reqId: string, message: string) => {
//     return this.reqCol
//       .doc(reqId)
//       .update({
//         messages: firebase.firestore.FieldValue.arrayUnion(message),
//       })
//       .then(() => {
//         console.log('Msg sent!');
//       })
//       .catch((error) => {
//         console.error('Error sending msg: ', error);
//       });
//   };
// }
