import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { listenToRequestRoom } from '@/store/actions/appointments';

import s from './MessageBox.module.css';
import Message from '../Message/Message';

const MessageBox = () => {
  const dispatch = useDispatch();
  const messageBoxRef = useRef(null); // Create a ref for the message box
  const userUid = useSelector(({ user }) => user.uid);
  const requestRoomId = useSelector(({ appointments }) => appointments.requestRoomId);
  const requestRoom = useSelector(({ appointments }) => appointments.requestRoom);

  const isClient = userUid === requestRoom?.clientUid;
  const isSpecialist = userUid === requestRoom?.specUid;

  // Set up Firestore listener
  useEffect(() => {
    if (requestRoomId) {
      const unsubscribe = dispatch(listenToRequestRoom(requestRoomId));
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [dispatch, requestRoomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [requestRoom?.messages]); // Trigger scroll on messages update

  return (
    <div ref={messageBoxRef} className={s.messageBox}>
      {!!requestRoom?.messages?.length &&
        requestRoom.messages
          .filter((message) => typeof message.timestamp === "number")
          .map((message, index) => (
            <Message
              key={message.timestamp}
              message={message}
              clientAvatar={requestRoom?.clientAvatar}
              specAvatar={requestRoom?.specAvatar}
              isSender={userUid === message?.senderID}
              isClient={isClient}
              isSpecialist={isSpecialist}
            />
          ))}
    </div>
  );
};

export default MessageBox;
