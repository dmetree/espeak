export const translateSelectOptions = (
  options: { value: string; label: string }[],
  t: any,
  translationKey: string
) => {
  return options.map((option) => ({
    value: option.value,
    label: t[translationKey][option.value] || option.label, // Translate label dynamically based on the translation key
  }));
};

export const translateSelectedValues = (
  value: { value: string; label: string } | { value: string; label: string }[] | null,
  t: any,
  translationKey: string
) => {
  if (!value) return null;

  if (Array.isArray(value)) {
    return value.map((selectedOption) => ({
      value: selectedOption.value,
      label: t[translationKey][selectedOption.value] || selectedOption.label,
    }));
  }

  // Single value
  return {
    value: value.value,
    label: t[translationKey][value.value] || value.label,
  };
};

