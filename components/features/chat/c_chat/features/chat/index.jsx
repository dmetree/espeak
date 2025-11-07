import React from 'react';

import s from './.module.css';
import MessageBox from './ui/MessageBox/MessageBox';
import MessageInput from './ui/MessageInput/MessageInput';

export const Chat = ({ showChat }) => {
  return (
    <div className={s.chat}>
      <MessageBox />
      <MessageInput showChat={showChat} />
    </div>
  );
};
