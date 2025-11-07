import React from 'react';
import Button from '@/components/shared/ui/Button';
import { toast } from 'react-toastify';

import s from './../.module.scss';

type Props = {
  refLink: string;
  t: any;
};

export const CopyLink = ({ refLink, t }: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      toast.success("Ref Link copied!");
    } catch (error) {
      toast.error("Failed to copy Ref Link.");
    }
  };

  return (
    <div className={s.middleEl}>
      <span>{t.your_link}</span>
      <div className={s.refLink}>{refLink}</div>
      <Button className={s.copyBtn} onClick={handleCopy} size="l">
        {t.copy}
      </Button>
    </div>
  );
};
