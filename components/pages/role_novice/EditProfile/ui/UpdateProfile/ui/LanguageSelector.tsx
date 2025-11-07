import React from 'react';
import Select from 'react-select';
import { translateSelectedValues, translateSelectOptions } from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';

import s from './../.module.scss';

type Option = { value: string; label: string };

type Props = {
  value: Option[];
  // options: Option[];
  options: any;
  onChange: (selected: Option[]) => void;
  t: any;
};

const LanguageSelector: React.FC<Props> = ({ value, options, onChange, t }) => {
  const translatedOptions = translateSelectOptions(options, t, 'user-languages');
  const translatedSelectedValue = translateSelectedValues(value, t, 'user-languages');

  return(
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>{t.speak_language}</label>
      <Select
        isMulti
        name="langs"
        value={translatedSelectedValue}
        options={translatedOptions}
        onChange={onChange}
      />
    </div>
)};

export default LanguageSelector;
