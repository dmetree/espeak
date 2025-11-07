// components/Profile/LanguageSelector.tsx
import React from 'react';
import Select, { SingleValue, MultiValue } from 'react-select';
import s from './styles.module.scss';
import {
  translateSelectedValues,
  translateSelectOptions
} from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';

type Option = { value: string; label: string };

type Props = {
  value: Option | Option[] | null | any;
  options: Option[];
  onChange: (selected: Option | readonly Option[] | null) => void;
  t: any;
  isMulti?: boolean;
  labelKey?: string;
};

const LanguageSelector: React.FC<Props> = ({ value, options, onChange, t, isMulti = false, labelKey }) => {
  const translatedOptions = translateSelectOptions(options, t, 'user-languages');
  const translatedSelectedValue = translateSelectedValues(value, t, 'user-languages');

  return (
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>
        {t[labelKey || 'speak_language']}
      </label>
      <Select<Option, boolean>
        isMulti={isMulti}
        name="langs"
        value={translatedSelectedValue as SingleValue<Option> | MultiValue<Option>}
        options={translatedOptions}
        onChange={(selected) => {
          if (Array.isArray(selected)) {
            // cast readonly Option[] -> Option[]
            onChange([...selected]);
          } else {
            onChange(selected);
          }
        }}
      />
    </div>
  );
};

export default LanguageSelector;
