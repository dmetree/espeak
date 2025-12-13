import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  translateSelectedValues,
  translateSelectOptions,
} from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/helpers/get-select-options';
import s from './../.module.scss';

type Option = { value: string; label: string };

type Props = {
  value: Option[];
  options: Option[];
  onChange: (selected: any) => void;
  t: any;
  /** Which translation dictionary to use for option labels (default: psy-methods). */
  translationKey?: string;
  /** Override visible label text. */
  label?: string;
  /** Override react-select name attribute. */
  name?: string;
  /** Allow creating custom options (useful for Topics). */
  isCreatable?: boolean;
};

const MethodSelector: React.FC<Props> = ({
  value,
  options,
  onChange,
  t,
  translationKey = 'psy-methods',
  label,
  name = 'methods',
  isCreatable = false,
}) => {
  const translatedOptions = translateSelectOptions(options, t, translationKey);
  const translatedSelectedValue = translateSelectedValues(value, t, translationKey);

  const SelectComponent: any = isCreatable ? CreatableSelect : Select;

  return (
    <div className={s.formLabel}>
      <SelectComponent
        isMulti
        name={name}
        value={translatedSelectedValue}
        options={translatedOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default MethodSelector;
