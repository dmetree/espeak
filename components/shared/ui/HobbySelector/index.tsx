import React from 'react';
import Select, { MultiValue } from 'react-select';
import s from './styles.module.scss';

export type HobbyOption = { value: string; label: string };

export type HobbySelectorProps = {
  value: HobbyOption[];
  onChange: (option: HobbyOption[]) => void;
  options?: HobbyOption[];
  placeholder?: string;
};

const defaultOptions: HobbyOption[] = [
  { value: 'traveling', label: 'Traveling' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'trampolining', label: 'Trampolining' },
  { value: 'travel', label: 'Travel' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'culture', label: 'Culture' },
];

const HobbySelector: React.FC<HobbySelectorProps> = ({
  value,
  onChange,
  options = defaultOptions,
  placeholder = 'Choose category',
}) => {
  return (
    <div className={s.hobbySelector}>
      <Select<HobbyOption, true>
        classNamePrefix="react-select"
        isMulti
        options={options}
        value={value as unknown as MultiValue<HobbyOption>}
        placeholder={placeholder}
        menuPlacement="top"
        onChange={(selected) => onChange(selected as HobbyOption[])}
      />
    </div>
  );
};

export default HobbySelector;
