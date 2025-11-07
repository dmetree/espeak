// @ts-nocheck
"use client";

import { LiveKitRoom } from "@livekit/components-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  DisconnectButton,
  TrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { AccessToken } from "livekit-server-sdk";
import { toast } from "react-toastify";
import '@livekit/components-styles';

import {
  nanoErgMinerFee,
} from '@/components/shared/utils/ergo-blockchain-utils';

import { hideModal } from "@/store/actions/modal";
import { showVideoCall, hideVideoCall } from "@/store/actions/videoCall";

import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { EModalKind, EUserRole, } from "@/components/shared/types";
import Button from "@/components/shared/ui/Button";
import { Chat } from "../chat";
import ChatHeader from './ChatHeader/chatHeader';
import { buildClientEndProblem } from "@/blockchain/ergo/offchain/app/transactions/endSessionProblemClientTx/endSessionProblemClient";
import { TransactionHelperEndSessionProblemClient } from "@/blockchain/ergo/offchain/app/transactions/endSessionProblemClientTx/end-session-problem-client-transaction-helper";

import { AppDispatch } from "@/store";
import s from "./Videos.module.scss";
import { clientSubmitComplaint } from "@/store/actions/appointments";

export default function Page() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const requestRoomId = useSelector(({ appointments }) => appointments.requestRoomId);
  const requestRoom = useSelector(({ appointments }) => appointments.requestRoom);
  const videoCall = useSelector(({ video }) => video.showVideoCall);
  const userData = useSelector(({ user }) => user?.userData);
  const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
  const ergoCustomerWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const isClient = userData?.userRole === EUserRole.Novice;


  const [showChat, setShowChat] = useState(true);
  const [token, setToken] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (!videoCall) {
      setShowChat(true)
    }

  }, [videoCall])


  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const submitComplain = async () => {
    const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${requestRoom?.singletonId}`);
    const data = await response.json();

    // console.log('data', data.items[0])

    if (data.items && data.items.length > 0) {
      // The first box in the result should be your session box
      const sessionBox = data.items[0];


      const ergo = await ergoConnector.nautilus.getContext();
      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelperEndSessionProblemClient(ergo);


      await buildClientEndProblem(
        sessionBox,
        ergoCustomerWalletAddress,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper,
      )
    }

    dispatch(clientSubmitComplaint(requestRoomId));
    toast.success("Complaint submitted");
  }

  const endSession = async () => {
    try {
      setToken('');
      dispatch(hideModal(EModalKind.VideoCall));
      // toast.success("The call finished successfully");
    } catch {
      toast.error("Error during call finished");
    }
  };

  const handleDisconnectCall = () => {
    const frame = document.querySelector(`.${s.frame_for_call}`);
    const chatSessionWrap = document.querySelector(`.${s.chat_sesssion_wrap}`);
    dispatch(hideVideoCall());

    if (frame) {
      frame.style.display = 'none';
    }
    if (chatSessionWrap) {
      chatSessionWrap.classList.add(s.justChat);
    }

    // toast.success("Call disconnected");
  };

  const initiateVideoCall = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_LK_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_LK_API_SECRET;

      if (!apiKey || !apiSecret) {
        throw new Error('Missing API Key or Secret');
      }

      const at = new AccessToken(apiKey, apiSecret, { identity: userData.nickname });
      at.addGrant({ room: requestRoomId, roomJoin: true, canPublish: true, canSubscribe: true });

      const token = await at.toJwt();
      console.log('token', token)
      setToken(token);
      dispatch(showVideoCall());

      if (isMobile) {
        setShowChat(false);
      }
    } catch (e) {
      console.error('Error generating token:', e);
    }
  };

  return (
    <div className={`${s.videos} ${(isMobile && videoCall && showChat) ? s.videosMobileView : ''}`}>

      {!videoCall &&
        <ChatHeader
          videoCall={videoCall}
          initiateVideoCall={initiateVideoCall}
          t={t}
          isClient={isClient}
          submitComplain={submitComplain}
          handleDisconnectCall={handleDisconnectCall}
          endSession={endSession}
          toggleChat={toggleChat}
          showChat={showChat}
          requestRoom={requestRoom}
        />
      }


      <div className={`${s.videosCalls} ${isMobile ? s.mobileView : ''}`}>
        {videoCall && token && (
          <div className={`${s.frame_for_call} ${!showChat || isMobile ? s.fullWidth : ''}`}>
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
              data-lk-theme="default"
              style={{ height: isMobile ? '100dvh' : '98dvh' }}
              connect={true}
            >
              <MyVideoConference />
              <RoomAudioRenderer />
              <div className={s.callButtonsWrap}>
                <TrackToggle source={Track.Source.Microphone} />
                <TrackToggle source={Track.Source.Camera} />
                <div className={s.videoButton}>
                  <Button onClick={toggleChat}>
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className={s.openCloseChat}
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z" />
                    </svg>
                  </Button>
                </div>
                <div className={s.videoButton}>
                  <DisconnectButton
                    onClick={() => {
                      handleDisconnectCall()
                      setToken('');
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-1 -1 26 26"
                      width="30"
                      height="30"
                      className={s.endCallIcon}
                    >
                      <path d="M0,12c0,6.617,5.383,12,12,12s12-5.383,12-12C24,5.383,18.617,0,12,0S0,5.383,0,12Zm5-3.11c0-.826,.298-1.654,.928-2.283l1.607-1.607,3.164,3.164-2.071,2.071c1.029,2.561,2.772,4.234,5.137,5.137l2.071-2.071,3.164,3.164-1.607,1.607c-.629,.63-1.457,.928-2.283,.928-4.24,0-10.11-5.544-10.11-10.11Z" />
                    </svg>
                    {t.end_call}

                  </DisconnectButton>
                </div>
              </div>
            </LiveKitRoom>
          </div>
        )}

        <div className={`
          ${s.chat_sesssion_wrap}
          ${!videoCall ? s.justChat : ''}
          ${isMobile && videoCall ? s.mobileChatOverlay : ''}
          ${!showChat ? s.chatHidden : s.chatVisible}
        `}>
          {(isMobile && videoCall && showChat) && <div onClick={() => setShowChat(false)} className={s.closeBtnMobile}>X</div>}
          <div className={s.chatWrapper}>
            <Chat showChat={showChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  if (tracks.length === 0) {
    return <div>No participants or tracks available.</div>;
  }

  return (
    <GridLayout
      tracks={tracks}
    // style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
