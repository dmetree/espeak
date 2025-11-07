import React from 'react';
import Image from 'next/image';
import s from './Message.module.css';

const Message = ({ isSender, message, clientAvatar, specAvatar, isClient, isSpecialist }) => {
  const avatarSrc = isSender
    ? (isClient ? clientAvatar : specAvatar)
    : (isClient ? specAvatar : clientAvatar);

  return (
    <div className={`${s.message} ${isSender ? s.sender : s.receiver}`}>
      <div className={`${s.msg} ${isSender ? s.myMsg : s.guestMsg}`}>
        <Image
          width={60}
          height={60}
          src={avatarSrc}
          className={s.avatarImg}
          alt="User Avatar"
          loading="lazy"
        />
        <div className={s.messageContent}>
          <div className={s.messageName}>{message?.name}</div>
          <div className={`${s.text} ${isSender ? s.myText : s.guestText}`}>

            <div className="">{message?.text}</div>
            <span className={s.timeStamp}>
              {(() => {
                const date = new Date(message?.timestamp); // Convert Unix time to Date
                const hours = date.getHours().toString().padStart(2, "0");
                const minutes = date.getMinutes().toString().padStart(2, "0");
                // const day = date.getDate();
                // const month = date.toLocaleString("en-US", { month: "short" }); // Use 'short' for abbreviated month

                return `${hours}:${minutes} `;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
