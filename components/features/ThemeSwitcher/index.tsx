import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { applyTheme } from '@/components/shared/utils/applyTheme';
import Button from '@/components/shared/ui/Button';

import s from './.module.scss';

const iconMap = {
  lightIcon: (
    <svg
      className={s.themeIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5Zm1-13V1c0-.55-.45-1-1-1s-1,.45-1,1v3c0,.55,.45,1,1,1s1-.45,1-1Zm0,19v-3c0-.55-.45-1-1-1s-1,.45-1,1v3c0,.55,.45,1,1,1s1-.45,1-1ZM5,12c0-.55-.45-1-1-1H1c-.55,0-1,.45-1,1s.45,1,1,1h3c.55,0,1-.45,1-1Zm19,0c0-.55-.45-1-1-1h-3c-.55,0-1,.45-1,1s.45,1,1,1h3c.55,0,1-.45,1-1ZM6.71,6.71c.39-.39,.39-1.02,0-1.41l-2-2c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l2,2c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Zm14,14c.39-.39,.39-1.02,0-1.41l-2-2c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l2,2c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Zm-16,0l2-2c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-2,2c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29ZM18.71,6.71l2-2c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-2,2c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Z" />
    </svg>
  ),
  darkIcon: (
    <svg
      className={s.themeIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="15"
      height="15"
    >
      <path d="M15,24a12.021,12.021,0,0,1-8.914-3.966,11.9,11.9,0,0,1-3.02-9.309A12.122,12.122,0,0,1,13.085.152a13.061,13.061,0,0,1,5.031.205,2.5,2.5,0,0,1,1.108,4.226c-4.56,4.166-4.164,10.644.807,14.41a2.5,2.5,0,0,1-.7,4.32A13.894,13.894,0,0,1,15,24Z" />
    </svg>
  ),
};

const ThemeSwitcher = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'default');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'default' ? 'dark-theme' : 'default';
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div
      className={`${s.themeSwither} ${theme === 'default' ? 'light-theme' : 'dark-theme'}`}
      onClick={handleThemeToggle}
    >
      {theme === 'default' ? iconMap.lightIcon : iconMap.darkIcon}
    </div>
  );
};

export default ThemeSwitcher;
