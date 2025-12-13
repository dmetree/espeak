import React from 'react';
import Select from 'react-select';
import {
  translateSelectedValues,
  translateSelectOptions,
} from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';

import s from './../.module.scss';

type Option = { value: string; label: string };

type Props = {
  value: Option | Option[] | null;
  options: Option[];
  onChange: (selected: any) => void;
  t: any;
  label?: string;
  isMulti?: boolean;
};

const LanguageSelector: React.FC<Props> = ({
  value,
  options,
  onChange,
  t,
  label,
  isMulti = true,
}) => {
  const translatedOptions = translateSelectOptions(options, t, 'user-languages');
  const translatedSelectedValue = translateSelectedValues(value, t, 'user-languages');

  return (
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>
        {label || t.speak_language}
      </label>
      <Select
        isMulti={isMulti}
        name="langs"
        value={translatedSelectedValue as any}
        options={translatedOptions}
        onChange={onChange as any}
      />
    </div>
  );
};

export default LanguageSelector;
