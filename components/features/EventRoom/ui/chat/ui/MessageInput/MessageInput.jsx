import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from '@/store/actions/appointments';
import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";

import s from './MessageInput.module.scss';

const MessageInput = ({ showChat }) => {
  const dispatch = useDispatch();

  const userUid = useSelector(({ user }) => user.uid);
  const requestRoomId = useSelector(({ appointments }) => appointments.requestRoomId);

  const [value, setValue] = useState('');

  const newMessage = {
    senderID: userUid,
    text: value,
    timestamp: new Date(),
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (value.trim() === '') {
      alert('Enter valid message!');
      return;
    }

    dispatch(sendMessage(requestRoomId, newMessage))
    setValue('');
  };

  return (
    <div className={s.msgInput}>
      <form className={`${s.inputForm} ${showChat ? s.fillInput : ''}`} onSubmit={handleSendMessage}>
        <input
          className={s.input}
          value={value}
          hint="Message"
          onChange={(e) => setValue(e.target.value)}
          type="text"
        />
        <Button className={s.sendButton} type="submit" disabled={value === ''}>
          &#10148;
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
