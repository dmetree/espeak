import React, { FC } from 'react';

import { convertStatus } from '@/components/shared/utils/convert-status';
import { getRequestColor } from '@/components/shared/utils/req-color';
import { EReqStatus } from '@/components/shared/types/types';

import s from "./.module.scss";

type TStatusIndicatorProps = {
  statuses: EReqStatus[];
};

const CAPACITY = 6;

export const StatusIndicators: FC<TStatusIndicatorProps> = ({ statuses }) => {
  const converted = statuses.map((status) => convertStatus(status));
  const outOfCapacity = converted.length > CAPACITY;
  let toRender = converted;
  if (outOfCapacity) {
    toRender = Array.from(new Set(converted)); // only unique statuses
  }
  toRender = toRender.slice(0, CAPACITY - 1);

  return (
    <div className={s.indicatorContainer}>
      {toRender.map((status, i) => {
        return <div
          className={s.indicator}
          key={status + i}
          style={{ backgroundColor: getRequestColor(status) }}
        />;
      })}
    </div>
  );
};
