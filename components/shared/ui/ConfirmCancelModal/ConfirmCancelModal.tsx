import React, { useEffect, useRef } from 'react';
import Button from '@/components/shared/ui/Button';

import s from './style.module.scss';

export const ConfirmCancelModal = ({ meta, onConfirm, onClose, t, status }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
        <div className={s.modalBackdrop} />
        <div className={s.modalOverlay}>
            <div ref={boxRef} className={s.modalBox}>
                <h2>{t.confirm_cancel_title}</h2>
                {status == 'client' && (
                  <p>{t.session_already_accepted}</p>
                )}

                {status == 'table' && (
                  <p>{t.session_already_accepted_by_psychologist}</p>
                )}


                {(status == 'client' && meta?.isClientCancelPenalty) && (
                    <p>
                        <p className={s.penalty}>⚠️ {t.cancel_penalty_warning}</p>
                        <br />
                        {t.time_remaining_before_session}: ~{(meta.blocksBeforeStart * 2 / 60).toFixed(1)} {t.hours}
                    </p>
                )}

                {(status == 'client' && !meta?.isClientCancelPenalty) && (
                  <p className={s.safe}>{t.cancel_no_penalty}</p>
                )}


                {status == 'table' && (
                  <p>
                        <p className={s.penalty}>⚠️ {t.cancel_penalty_warning_psy}</p>
                        <br />
                        {t.time_remaining_before_session}: ~{(meta.blocksBeforeStart * 2 / 60).toFixed(1)} {t.hours}
                    </p>
                )}

                <div className={s.actions}>
                    <Button onClick={onConfirm}>{t.confirm_yes}</Button>
                    <Button cancel onClick={onClose}>{t.confirm_no}</Button>
                </div>
            </div>
        </div>
    </>
  );
};
