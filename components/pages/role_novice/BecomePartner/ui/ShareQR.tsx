import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import s from '././../.module.scss';

type Props = {
  refLink: string;
  t: any;
};

export const ShareQR = ({ refLink, t }: Props) => {
  return (
    <div className={s.qr_share}>
      <QRCodeCanvas value={refLink} size={150} />
      <div className={s.shareSection}>
        <h4>{t.share_qr_title || "Share your QR code"}</h4>
        <div className={s.shareButtons}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(refLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={s.shareBtn}
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(t.share_ref_msg || "Check out this link!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={s.shareBtn}
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
};
