
// @ts-nocheck
import React, { memo } from 'react';

import classNames from '@/components/shared/utils/utils';

import cls from './Icon.module.css';

export const Icon = memo((props) => {

  const {
    className,
    Svg,
    width = 32,
    height = 32,
    clickable,
    ...otherProps
  } = props;

  const icon = (
    <Svg
      className={classNames(cls.Icon, {}, [className])}
      width={width}
      height={height}
      {...otherProps}
      onClick={undefined}
    />
  );

  if (clickable) {
    return (
      <button
        type="button"
        className={cls.button}
        onClick={props.onClick}
        style={{ height, width }}
      >
        {icon}
      </button>
    );
  }

  return icon;
});

// Add display name for better debugging
Icon.displayName = 'Icon';
