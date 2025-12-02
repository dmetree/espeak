import { useState } from 'react';

import { FilterDropdown } from '@/components/pages/ViewExperts/ui/FilterDropdown/FilterDropdown';
import { PriceRangeFilter } from '@/components/pages/ViewExperts/ui/PriceRangeFilter/PriceRangeFilter';

import styles from './styles.module.scss';

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
  // use language *codes* as values (e.g. 'en')
  const [learnLanguage, setLearnLanguage] = useState<string | null>(null);
  const [teacherType, setTeacherType] = useState<'Both' | 'Teacher' | 'Tutor'>('Both');
  const [speaksLanguage, setSpeaksLanguage] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(4);
  const [maxPrice, setMaxPrice] = useState<number>(80);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pl', label: 'Polish' },
  ];

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

  return (
    <div className={styles.filtersBar}>
      <FilterDropdown
        label="I want to learn"
        options={languageOptions}
        selectedValue={learnLanguage ?? undefined}
        onChange={handleLearnLanguageChange}
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
      />
      <PriceRangeFilter onChange={handlePriceChange} />
    </div>
  );
}
