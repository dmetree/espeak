import { useMemo, useState } from 'react';

import { FilterDropdown } from '@/components/pages/ViewExperts/ui/FilterDropdown/FilterDropdown';
import { PriceRangeFilter } from '@/components/pages/ViewExperts/ui/PriceRangeFilter/PriceRangeFilter';

import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

export type FiltersState = {
  learnLanguage: string | null;
  teacherType: 'Both' | 'Teacher' | 'Tutor';
  speaksLanguage: string | null;
  minPrice: number;
  maxPrice: number;
};

interface FiltersBarProps {
  onFiltersChange?: (filters: FiltersState) => void;
}

export function FiltersBar({ onFiltersChange }: FiltersBarProps) {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const DEFAULTS: FiltersState = {
    learnLanguage: null,
    teacherType: 'Both',
    speaksLanguage: null,
    minPrice: 4,
    maxPrice: 80,
  };

  // use language *codes* as values (e.g. 'en')
  const [learnLanguage, setLearnLanguage] = useState<string | null>(DEFAULTS.learnLanguage);
  const [teacherType, setTeacherType] = useState<'Both' | 'Teacher' | 'Tutor'>(DEFAULTS.teacherType);
  const [speaksLanguage, setSpeaksLanguage] = useState<string | null>(DEFAULTS.speaksLanguage);
  const [minPrice, setMinPrice] = useState<number>(DEFAULTS.minPrice);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULTS.maxPrice);

  const languageOptions = useMemo(() => {
    const dict = t?.['user-languages'] || {};
    return Object.entries(dict)
      .map(([value, label]) => ({ value: String(value), label: String(label) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [t]);

  const teacherTypeOptions = [
    { value: 'Both', label: 'Both' },
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Tutor', label: 'Tutor' },
  ];

  const emitFilters = (next: Partial<FiltersState>) => {
    if (!onFiltersChange) return;

    const merged: FiltersState = {
      learnLanguage,
      teacherType,
      speaksLanguage,
      minPrice,
      maxPrice,
      ...next,
    };

    onFiltersChange(merged);
  };

  const handleLearnLanguageChange = (value: string) => {
    setLearnLanguage(value);
    emitFilters({ learnLanguage: value });
  };

  const handleTeacherTypeChange = (value: string) => {
    const casted = value as 'Both' | 'Teacher' | 'Tutor';
    setTeacherType(casted);
    emitFilters({ teacherType: casted });
  };

  const handleSpeaksLanguageChange = (value: string) => {
    setSpeaksLanguage(value);
    emitFilters({ speaksLanguage: value });
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    emitFilters({ minPrice: min, maxPrice: max });
  };

  const handleClearFilters = () => {
    setLearnLanguage(DEFAULTS.learnLanguage);
    setTeacherType(DEFAULTS.teacherType);
    setSpeaksLanguage(DEFAULTS.speaksLanguage);
    setMinPrice(DEFAULTS.minPrice);
    setMaxPrice(DEFAULTS.maxPrice);
    emitFilters({ ...DEFAULTS });
  };

  const isDefault =
    learnLanguage === DEFAULTS.learnLanguage &&
    teacherType === DEFAULTS.teacherType &&
    speaksLanguage === DEFAULTS.speaksLanguage &&
    minPrice === DEFAULTS.minPrice &&
    maxPrice === DEFAULTS.maxPrice;

  return (
    <div className={styles.filtersBar}>
      <FilterDropdown
        label="I want to learn"
        options={languageOptions}
        selectedValue={learnLanguage ?? undefined}
        onChange={handleLearnLanguageChange}
        searchable
        searchPlaceholder="Search language"
      />

      <FilterDropdown
        label="Teacher type"
        options={teacherTypeOptions}
        selectedValue={teacherType}
        onChange={handleTeacherTypeChange}
      />
      <FilterDropdown
        label="Speaks"
        options={languageOptions}
        selectedValue={speaksLanguage ?? undefined}
        onChange={handleSpeaksLanguageChange}
        searchable
        searchPlaceholder="Search language"
      />
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChange={handlePriceChange}
      />

      <button
        type="button"
        className={styles.clearButton}
        onClick={handleClearFilters}
        disabled={isDefault}
      >
        Clear filters
      </button>
    </div>
  );
}
