import React from 'react';
import Button from '@/components/shared/ui/Button';
import s from './../.module.scss';

type Props = {
  onClick: () => void;
  disabled: boolean;
  t: any;
};

export const GenerateRefButton = ({ onClick, disabled, t }: Props) => (
  <Button disabled={disabled} onClick={onClick}>
    {t.generate_link}
  </Button>
);
