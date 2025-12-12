export const translateSelectOptions = (
  options: { value: string; label: string }[],
  t: any,
  translationKey?: string
) => {
  const dict = translationKey ? t?.[translationKey] || {} : {};

  return options.map((option) => ({
    value: option.value,
    label: dict?.[option.value] || option.label,
  }));
};

export const translateSelectedValues = (
  value:
    | { value: string; label: string }
    | { value: string; label: string }[]
    | null,
  t: any,
  translationKey?: string
) => {
  if (!value) return null;

  const dict = translationKey ? t?.[translationKey] || {} : {};

  if (Array.isArray(value)) {
    return value.map((selectedOption) => ({
      value: selectedOption.value,
      label: dict?.[selectedOption.value] || selectedOption.label,
    }));
  }

  return {
    value: value.value,
    label: dict?.[value.value] || value.label,
  };
};

