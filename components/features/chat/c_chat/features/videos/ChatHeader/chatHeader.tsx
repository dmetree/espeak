// "use client";
// import { useState, useEffect } from "react";
// import { EModalKind, EUserRole } from '@/components/shared/types';
// import { useSelector } from "react-redux";
// import Button from "@/components/shared/ui/Button";
// import { Tooltip } from "@/components/shared/ui/Tooltip/Tooltip";

// import {
//     nodeNetwork,
//     nanoErgSessionValue,
//     nanoErgMinerFee,
//     p2pkInputAmount,
// } from '@/components/shared/utils/ergo-blockchain-utils';

// import s from "./ChatHeader.module.scss";
// import { buildEndServiceBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionServiceBadAdminTx/endSessionServiceBad";
// import { TransactionHelperEndSessionServiceBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionServiceBadAdminTx/end-session-service-bad-transaction-helper";
// import { buildEndPsychBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychBadAdminTx/endSessionPsychBad";
// import { TransactionHelperEndSessionPsychBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychBadAdminTx/end-session-psych-bad-transaction-helper";
// import { buildEndClientBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionClientBadAdminTx/endSessionClientBad";
// import { TransactionHelperEndSessionClientBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionClientBadAdminTx/end-session-client-bad-transaction-helper";

// const ChatHeader = ({
//     isClient,
//     videoCall,
//     initiateVideoCall,
//     t,
//     submitComplain,
//     handleDisconnectCall,
//     endSession,
//     toggleChat,
//     showChat,
//     requestRoom
// }) => {

//     const userRole = useSelector(({ user }) => user?.userData.userRole);
//     const isAdmin = userRole === EUserRole.Admin;

//     const hasComplaint = requestRoom?.complaintFromClient;
//     const singletonId = requestRoom?.singletonId;


//     const handleServceBad = async (singletonId) => {
//         const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
//         const data = await response.json();

//         if (data.items && data.items.length > 0) {
//             const sessionBox = data.items[0];

//             const ergo = await ergoConnector.nautilus.getContext();
//             const nodeHeight = await ergo.get_current_height();
//             const transactionHelper = new TransactionHelperEndSessionServiceBad(ergo);

//             await buildEndServiceBad(
//                 sessionBox,
//                 nanoErgMinerFee,
//                 nodeHeight,
//                 transactionHelper,
//             )
//         }
//         console.log("Service bad")
//         // TODO add dispatcher with backend logic
//     }


//     const handleTherapistBad = async (singletonId) => {
//         const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
//         const data = await response.json();

//         if (data.items && data.items.length > 0) {
//             const sessionBox = data.items[0];

//             const ergo = await ergoConnector.nautilus.getContext();
//             const nodeHeight = await ergo.get_current_height();
//             const transactionHelper = new TransactionHelperEndSessionPsychBad(ergo);

//             await buildEndPsychBad(
//                 sessionBox,
//                 nanoErgMinerFee,
//                 nodeHeight,
//                 transactionHelper,
//             )
//         }
//         console.log("Therapist bad")
//         // TODO add dispatcher with backend logic
//     }



//     const handleClientBad = async (singletonId) => {
//         const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
//         const data = await response.json();

//         if (data.items && data.items.length > 0) {
//             const sessionBox = data.items[0];

//             const ergo = await ergoConnector.nautilus.getContext();
//             const nodeHeight = await ergo.get_current_height();
//             const transactionHelper = new TransactionHelperEndSessionClientBad(ergo);

//             await buildEndClientBad(
//                 sessionBox,
//                 nanoErgMinerFee,
//                 nodeHeight,
//                 transactionHelper,
//             )
//         }
//         console.log("Client bad")
//         // TODO add dispatcher with backend logic
//     }


//     return (
//         <div className={s.videosHeader}>
//             {!videoCall && (
//                 <div className={s.complainNav}>

//                     {isAdmin &&
//                         <span className={s.adminNav}>
//                             <Button
//                                 onClick={() => handleServceBad(singletonId)}
//                                 cancel
//                                 className={`${s.videoButton} ${s.offchainBtn}`}>
//                                 <span>Service</span>
//                                 😔
//                             </Button>
//                             <Button
//                                 onClick={() => handleTherapistBad(singletonId)}
//                                 cancel
//                                 className={`${s.videoButton} ${s.offchainBtn}`}>
//                                 <span>Therapist</span>
//                                 😔
//                             </Button>
//                             <Button
//                                 onClick={() => handleClientBad(singletonId)}
//                                 cancel
//                                 className={`${s.videoButton} ${s.offchainBtn}`}>
//                                 <span>Client</span>
//                                 😔
//                             </Button>
//                         </span>
//                     }

//                     {/* {isClient &&
//                         <>
//                             <Tooltip title={t.report_tooltip} />
//                             <Button
//                                 disabled={hasComplaint}
//                                 onClick={submitComplain} cancel
//                                 className={`${s.videoButton} ${s.headerSessionButton}`}
//                             >
//                                 {hasComplaint ? <>Complait submitted.</> : t.report}
//                             </Button>
//                         </>
//                     } */}
//                 </div>
//             )}


//             {!videoCall && (
//                 <Button
//                     onClick={initiateVideoCall}
//                     className={`${s.videoButton} ${s.headerSessionButton}`}
//                 // disabled={isJoinDisabled}
//                 // style={{ cursor: isJoinDisabled ? 'not-allowed' : 'pointer' }}
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="-1 -1 26 26"
//                         width="20"
//                         height="20"
//                         className={s.joinCallIcon}
//                     >
//                         <path d="M0,12c0,6.617,5.383,12,12,12s12-5.383,12-12C24,5.383,18.617,0,12,0S0,5.383,0,12Zm5-3.11c0-.826,.298-1.654,.928-2.283l1.607-1.607,3.164,3.164-2.071,2.071c1.029,2.561,2.772,4.234,5.137,5.137l2.071-2.071,3.164,3.164-1.607,1.607c-.629,.63-1.457,.928-2.283,.928-4.24,0-10.11-5.544-10.11-10.11Z" />
//                     </svg>
//                     {t.join_call}
//                 </Button>
//             )}


//             {!videoCall && (
//                 <Button
//                     onClick={endSession} cancel
//                     className={`${s.videoButton} ${s.headerSessionButton}`}>
//                     X
//                 </Button>
//             )}
//         </div>
//     )
// }

// export default ChatHeader;


"use client";
import { useState, useEffect, useMemo } from "react";
import { EModalKind, EUserRole } from '@/components/shared/types';
import { useSelector } from "react-redux";
import Button from "@/components/shared/ui/Button";
import { Tooltip } from "@/components/shared/ui/Tooltip/Tooltip";

import {
    nodeNetwork,
    nanoErgSessionValue,
    nanoErgMinerFee,
    p2pkInputAmount,
} from '@/components/shared/utils/ergo-blockchain-utils';

import s from "./ChatHeader.module.scss";
import { buildEndServiceBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionServiceBadAdminTx/endSessionServiceBad";
import { TransactionHelperEndSessionServiceBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionServiceBadAdminTx/end-session-service-bad-transaction-helper";
import { buildEndPsychBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychBadAdminTx/endSessionPsychBad";
import { TransactionHelperEndSessionPsychBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychBadAdminTx/end-session-psych-bad-transaction-helper";
import { buildEndClientBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionClientBadAdminTx/endSessionClientBad";
import { TransactionHelperEndSessionClientBad } from "@/blockchain/ergo/offchain/app/transactions/endSessionClientBadAdminTx/end-session-client-bad-transaction-helper";

const ChatHeader = ({
    isClient,
    videoCall,
    initiateVideoCall,
    t,
    submitComplain,
    handleDisconnectCall,
    endSession,
    toggleChat,
    showChat,
    requestRoom
}) => {

    const userRole = useSelector(({ user }) => user?.userData.userRole);
    const isAdmin = userRole === EUserRole.Admin;
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);

    const hasComplaint = requestRoom?.complaintFromClient;
    const singletonId = requestRoom?.singletonId;

    // Find the current appointment from all therapist appointments
    const currentAppointment = useMemo(() => {
        return myAppointments?.find(appt => appt.singletonId === singletonId);
    }, [myAppointments, singletonId]);

    const scheduledTime = currentAppointment?.scheduledUnixtime ? currentAppointment.scheduledUnixtime * 1000 : null;
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 300000); // update every 30s
        return () => clearInterval(interval);
    }, []);

    const isJoinDisabled = useMemo(() => {
        if (!scheduledTime) return true;

        const fiveMinutesBefore = scheduledTime - 5 * 60 * 1000;
        const oneHourAfter = scheduledTime + 60 * 60 * 1000;

        return now < fiveMinutesBefore || now > oneHourAfter;
    }, [scheduledTime, now]);

    const handleServceBad = async (singletonId) => {
        const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const sessionBox = data.items[0];

            const ergo = await ergoConnector.nautilus.getContext();
            const nodeHeight = await ergo.get_current_height();
            const transactionHelper = new TransactionHelperEndSessionServiceBad(ergo);

            await buildEndServiceBad(
                sessionBox,
                nanoErgMinerFee,
                nodeHeight,
                transactionHelper,
            )
        }
    }

    const handleTherapistBad = async (singletonId) => {
        const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const sessionBox = data.items[0];

            const ergo = await ergoConnector.nautilus.getContext();
            const nodeHeight = await ergo.get_current_height();
            const transactionHelper = new TransactionHelperEndSessionPsychBad(ergo);

            await buildEndPsychBad(
                sessionBox,
                nanoErgMinerFee,
                nodeHeight,
                transactionHelper,
            )
        }
    }

    const handleClientBad = async (singletonId) => {
        const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const sessionBox = data.items[0];

            const ergo = await ergoConnector.nautilus.getContext();
            const nodeHeight = await ergo.get_current_height();
            const transactionHelper = new TransactionHelperEndSessionClientBad(ergo);

            await buildEndClientBad(
                sessionBox,
                nanoErgMinerFee,
                nodeHeight,
                transactionHelper,
            )
        }
    }

    return (
        <div className={s.videosHeader}>
            {!videoCall && (
                <div className={s.complainNav}>
                    {isAdmin &&
                        <span className={s.adminNav}>
                            <Button onClick={() => handleServceBad(singletonId)} cancel className={`${s.videoButton} ${s.offchainBtn}`}>
                                <span>Service</span> 😔
                            </Button>
                            <Button onClick={() => handleTherapistBad(singletonId)} cancel className={`${s.videoButton} ${s.offchainBtn}`}>
                                <span>Therapist</span> 😔
                            </Button>
                            <Button onClick={() => handleClientBad(singletonId)} cancel className={`${s.videoButton} ${s.offchainBtn}`}>
                                <span>Client</span> 😔
                            </Button>
                        </span>
                    }

                    {/* {isClient &&
                        <>
                            <Tooltip title={t.report_tooltip} />
                            <Button
                                disabled={hasComplaint}
                                onClick={submitComplain} cancel
                                className={`${s.videoButton} ${s.headerSessionButton}`}
                            >
                                {hasComplaint ? <>Complait submitted.</> : t.report}
                            </Button>
                        </>
                    } */}
                </div>
            )}

            {!videoCall && (
                <Button
                    onClick={initiateVideoCall}
                    // disabled={isJoinDisabled}
                    className={`${s.videoButton} ${s.headerSessionButton}`}
                // style={{ cursor: isJoinDisabled ? 'not-allowed' : 'pointer' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26" width="20" height="20" className={s.joinCallIcon}>
                        <path d="M0,12c0,6.617,5.383,12,12,12s12-5.383,12-12C24,5.383,18.617,0,12,0S0,5.383,0,12Zm5-3.11c0-.826,.298-1.654,.928-2.283l1.607-1.607,3.164,3.164-2.071,2.071c1.029,2.561,2.772,4.234,5.137,5.137l2.071-2.071,3.164,3.164-1.607,1.607c-.629,.63-1.457,.928-2.283,.928-4.24,0-10.11-5.544-10.11-10.11Z" />
                    </svg>
                    {t.join_call}
                </Button>
            )}

            {!videoCall && (
                <Button onClick={endSession} cancel className={`${s.videoButton} ${s.headerSessionButton}`}>X</Button>
            )}
        </div>
    );
};

export default ChatHeader;
