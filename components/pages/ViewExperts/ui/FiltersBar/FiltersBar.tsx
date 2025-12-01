import { useState } from 'react';

import { FilterDropdown } from '@/components/pages/ViewExperts/ui/FilterDropdown/FilterDropdown';
import { PriceRangeFilter } from '@/components/pages/ViewExperts/ui/PriceRangeFilter/PriceRangeFilter';

import styles from './styles.module.scss';


export function FiltersBar() {
  const [learnLanguage, setLearnLanguage] = useState('English');
  const [teacherType, setTeacherType] = useState('Both');
  const [speaksLanguage, setSpeaksLanguage] = useState('English');

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Polish', label: 'Polish' },
  ];

  const teacherTypeOptions = [
    { value: 'Both', label: 'Both' },
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Tutor', label: 'Tutor' },
  ];

  const handlePriceChange = (min: number, max: number) => {
    console.log('Price range:', min, max);
  };

  return (
    <div className={styles.filtersBar}>
      <FilterDropdown
        label="I want to learn"
        options={languageOptions}
        selectedValue={learnLanguage}
        onChange={setLearnLanguage}
      />
      <FilterDropdown
        label="Teacher type"
        options={teacherTypeOptions}
        selectedValue={teacherType}
        onChange={setTeacherType}
      />
      <FilterDropdown
        label="Speaks"
        options={languageOptions}
        selectedValue={speaksLanguage}
        onChange={setSpeaksLanguage}
      />
      <PriceRangeFilter onChange={handlePriceChange} />
    </div>
  );
}
