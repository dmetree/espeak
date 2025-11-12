import React from 'react';
import styles from './TeacherTypeSelector.module.scss';

const TeacherTypeSelector = ({ selected, onSelect }) => {
  const options = [
    { id: 'pro', title: 'Professional Tutor', desc: 'Certified or experienced teachers' },
    { id: 'community', title: 'Community Tutor', desc: 'Native speakers teaching informally' },
  ];

  return (
    <div className={styles.typeSelector}>
      {options.map((type) => {
        const isSelected = selected === type.id;

        return (
          <button
            key={type.id}
            className={`${styles.base} ${
              isSelected ? styles.selected : styles.normal
            }`}
            onClick={() => !isSelected && onSelect(type.id)}
            disabled={isSelected}
          >
            <h3 className={styles.title}>{type.title}</h3>
            <p className={styles.desc}>{type.desc}</p>
          </button>
        );
      })}
    </div>
  );
};

export default TeacherTypeSelector;
