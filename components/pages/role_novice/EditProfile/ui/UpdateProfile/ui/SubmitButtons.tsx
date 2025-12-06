import React from 'react';
import Button from '@/components/shared/ui/Button';
import s from './../.module.scss';

type Props = {
  loading: boolean;
  onDelete: () => void;
  t: any;
};

const SubmitButtons: React.FC<Props> = ({ loading, onDelete, t }) => (
  <div className={s.buttonsWrapper}>
    <Button type="submit" disabled={loading}>
      {loading ? t.saving : t.save}
    </Button>
    <Button className={s.deleteBtn} onClick={onDelete}>
      {t.delete_profile}
    </Button>
  </div>
);

export default SubmitButtons;
