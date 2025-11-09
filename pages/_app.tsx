// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { Provider } from 'react-redux';
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import AppProvider from '@/context/AppProvider';

// import { init, cardanoMainnetWalletConnect, WalletConnectConnector } from '@dcspark/adalib';
// // import Layout from '@/components/Layout';

// import blockchainReducer from '@/store/reducers/blockchain/blockchain';
// import networkCardanoReducer from '@/store/reducers/networkCardano';
// import networkErgoReducer from '@/store/reducers/networkErgo';
// import userReducer from '@/store/reducers/profile/user';
// import appointmentsReducer from '@/store/reducers/appointments';
// import videoReducer from '@/store/reducers/videoCall';
// import specialistsReducer from '@/store/reducers/specialists';
// import jobApplicationsReducer from '@/store/reducers/jobApplications';
// import postsReducer from '@/store/reducers/posts';
// import complaintsReducer from '@/store/reducers/complaints_check';
// import { modalReducer } from '@/store/reducers/modal';
// import { localeReducer } from '@/store/reducers/locale';

// import Background from '@/components/shared/ui/Background';

// import { ToastContainer } from 'react-toastify';

// import type { AppProps } from 'next/app';

// import '../styles/style.css';
// import 'react-toastify/dist/ReactToastify.css';


// import dynamic from "next/dynamic";
// import Loading from '@/components/shared/ui/Loader';
// import { compileFunction } from '@/blockchain/ergo/offchain/utils/compile';


// const Layout = dynamic(() => import('@/components/Layout'), {
//   ssr: false,
//   loading: () => <Loading />,
// });



// // Combine reducers into one root reducer
// const rootReducer = combineReducers({
//   modal: modalReducer,
//   locale: localeReducer,
//   blockchain: blockchainReducer,
//   networkCardano: networkCardanoReducer,
//   networkErgo: networkErgoReducer,
//   user: userReducer,
//   appointments: appointmentsReducer,
//   video: videoReducer,
//   specialists: specialistsReducer,
//   jobApplications: jobApplicationsReducer,
//   posts: postsReducer,
//   complaints: complaintsReducer,
// });

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();
//   const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];
//   const [loading, setLoading] = useState(true);
//   const [clientReady, setClientReady] = useState(false);

//   useEffect(() => {
//     setLoading(false);
//     setClientReady(true);
//     init(
//       () => ({
//         connectorName: WalletConnectConnector.connectorName(),
//         connectors: [
//           new WalletConnectConnector({
//             relayerRegion: 'wss://relay.walletconnect.com',
//             metadata: {
//               description: 'MindHealer | Ergo | Cardano',
//               name: 'MindHealer',
//               icons: [''],
//               url: process.env.NEXT_PUBLIC_APP_URL,
//             },
//             autoconnect: true,
//             qrcode: true,
//           }),
//         ],
//         chosenChain: cardanoMainnetWalletConnect(),
//       }),
//       '83e9907be3beb58b0c8e5468bb522e58'
//     );
//     // setLoading(false);
//   }, []);

//   if (path) {
//     router.replace(path);
//   }

//   if (!clientReady) return null;

//   if (loading) {
//     return <Loading />;
//   }

//   // compileFunction();

//   return (
//     <Provider store={store}>
//       <AppProvider>
//           <Background />
//           <Layout>
//             <Component {...pageProps} />
//           </Layout>
//       </AppProvider>
//     </Provider>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import AppProvider from '@/context/AppProvider';
import dynamic from 'next/dynamic';

import { store } from '@/store';
import { useWalletConnectInit } from '@/hooks/useWalletConnectInit';

import Background from '@/components/shared/ui/Background';
import Loading from '@/components/shared/ui/Loader';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/style.css';

import type { AppProps } from 'next/app';
import { compileFunction } from '@/blockchain/ergo/offchain/utils/compile';

const Layout = dynamic(() => import('@/components/Layout'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [clientReady, setClientReady] = useState(false);
  const router = useRouter();
  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];

  useEffect(() => {
    setClientReady(true);
  }, []);

  useWalletConnectInit();

  if (path) {
    router.replace(path);
  }

  if (!clientReady) {
    return (
      <>
        <Background />
        <Loading />
      </>
    );
  }

  // compileFunction();

  return (
    <Provider store={store}>
      <AppProvider>
        {/* <Background /> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </Provider>
  );
}

