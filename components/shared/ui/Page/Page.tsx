import classNames from '@/components/shared/utils/utils';
import cls from './Page.module.scss';

const Page = (props) => {
  const {
    className,
    children,
    width,
    color = 'base',
    landing = true,
    scroll = true,
    ...otherProps
  } = props;

  const mods = {};

  return (
    <div
      className={classNames(cls.page, mods, [
        className,
        cls[color],
        cls[width],
        landing && cls.landing,
        !scroll && cls.thereIsNoScroll,
      ])}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default Page;
