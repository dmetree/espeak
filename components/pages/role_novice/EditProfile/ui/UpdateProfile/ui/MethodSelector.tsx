import React from 'react';
import Select from 'react-select';
import { translateSelectedValues, translateSelectOptions } from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';
import s from './../.module.scss';

type Option = { value: string; label: string };

type Props = {
  value: Option[];
  options: Option[];
  onChange: (selected: Option[]) => void;
  t: any;
};

const MethodSelector: React.FC<Props> = ({ value, options, onChange, t }) => {
  const translatedOptions = translateSelectOptions(options, t, 'psy-methods');
  const translatedSelectedValue = translateSelectedValues(value, t, 'psy-methods');

  return (
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>{t.specialist_psy_methods}</label>
      <Select
        isMulti
        name="methods"
        value={translatedSelectedValue}
        options={translatedOptions}
        onChange={onChange}
      />
    </div>
)};

export default MethodSelector;
