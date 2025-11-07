// components/Profile/SpecialitySelector.tsx
import React from 'react';
import Select from 'react-select';
import s from './../.module.scss';
import { translateSelectedValues, translateSelectOptions } from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';

type Option = { value: string; label: string };

type Props = {
  value: Option[];
  options: Option[];
  onChange: (selected: Option[]) => void;
  t: any;
};

const SpecialitySelector: React.FC<Props> = ({ value, options, onChange, t }) => {
  const translatedOptions = translateSelectOptions(options, t, 'psy-speciality');
  const translatedSelectedValue = translateSelectedValues(value, t, 'psy-speciality');

  return (
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>{t.specialist_expert_in}</label>
      <Select
        isMulti
        name="specialities"
        value={translatedSelectedValue}
        options={translatedOptions}
        onChange={onChange}
      />
    </div>
)};

export default SpecialitySelector;
