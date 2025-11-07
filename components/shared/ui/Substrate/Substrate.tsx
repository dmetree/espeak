import classNames from '@/components/shared/utils/utils';

import cls from './Substrate.module.css';

const Substrate = (props) => {
  const {
    className,
    children,
    width,

    // variant = 'filled',
    // size = 'm',
    color = 'base',
    ...otherProps
  } = props;

  const mods = {};

  return (
    <div
      className={classNames(cls.substrate, mods, [
        className,
        cls[color],
        cls[width],
      ])}
    >
      {children}
    </div>
  );
};

export default Substrate;
