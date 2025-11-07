// import { FS } from '@common/shared/utils/firebase/fs-collection';

// export class VideoService {
//   // _root: RootStore;

//   // constructor(root: RootStore) {
//   //   this._root = root;
//   // }

//   reqCol: FS.TRequestsCollection;

//   constructor(reqCol: FS.TRequestsCollection) {
//     this.reqCol = reqCol;
//   }

//   answerCall = (reqId: string) => {
//     return this.reqCol
//       .doc(reqId)
//       .update({
//         caller: 'none',
//       })
//       .then(() => {
//         console.log('Document successfully updated!');
//       })
//       .catch((error) => {
//         // The document doesn't exist.
//         console.error('Error updating document: ', error);
//       });
//   };
// }
