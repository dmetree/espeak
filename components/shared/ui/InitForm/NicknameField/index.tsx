import React, { useState } from 'react';
import styles from './NameInput.module.scss';

export const NameInput = () => {
  const [name, setName] = useState('');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>What is your name/nickname?</h1>
      <p className={styles.subtitle}>
        Please, write your name or nickname
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Name/nickname</label>
        <input
          id="name"
          type="text"
          className={styles.input}
          placeholder="Carolina"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </div>
  );
};
