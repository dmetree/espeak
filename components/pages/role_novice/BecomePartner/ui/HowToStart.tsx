import React from 'react';
import Link from 'next/link';

import { useRouter } from "next/router";
import s from './../.module.scss';

type Props = {
  t: any;
};

export const HowToStart = ({ t }: Props) => {

  const router = useRouter();
  const handleGoToAffiliate = () => {
    router.push('/');
  }

  return (
    <div className={s.start_wrap}>
      <h3 className={s.h3}>{t.how_start}</h3>
      <div>
        <strong>0.</strong> <span className={s.actionOne} onClick={handleGoToAffiliate}>{t.create_account_at_mindhealer}</span>
      </div>
      <div>
        <strong>1.</strong> {t.how_start_one}
        <div>
          {t.download_nautilus_one}&nbsp;
          <Link href="https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai">
            {t.download_nautilus_two}
          </Link>
        </div>
        {/* <div className={s.notif}>{t.download_nautilus_instr}</div> */}
      </div>

      <div>
        <strong>2.</strong> {t.connect_nautilus}
      </div>

      <div>
        <strong>3.</strong> {t.generate_link_qr}&nbsp;
        <span>{t.when_connected_click}</span>
      </div>
    </div>
  )
};
