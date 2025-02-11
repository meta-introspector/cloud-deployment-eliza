import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './styles.module.css';

export default function ShowcaseSearchBar({
  onChange,
  value
}: {
  onChange: (value: string) => void;
  value: string;
}): JSX.Element {
  // Debounce the onChange callback
  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue);
    }, 200),
    [onChange]
  );

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search plugins..."
        className={styles.searchInput}
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
      />
    </div>
  );
}
