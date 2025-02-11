import React, {useState} from 'react';
import clsx from 'clsx';
import {TagList, Tags, type TagType} from '../../../../data/users';
import styles from './styles.module.css';

function ShowcaseTagSelect({
  tag,
  label,
  color,
  description,
  selected,
  onToggle,
}: {
  tag: TagType;
  label: string;
  color: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <li className={styles.tagListItem}>
      <button
        className={clsx(styles.tagButton, {
          [styles.tagButtonSelected]: selected,
        })}
        onClick={onToggle}
        style={{
          backgroundColor: selected ? color : 'transparent',
          borderColor: color,
          color: selected ? '#fff' : 'inherit',
        }}
        title={description}
      >
        {label}
      </button>
    </li>
  );
}

export default function ShowcaseFilters({
  selectedTags,
  toggleTag,
  operator,
  toggleOperator,
}: {
  selectedTags: TagType[];
  toggleTag: (tag: TagType) => void;
  operator: 'AND' | 'OR';
  toggleOperator: () => void;
}): JSX.Element {
  return (
    <section className="container margin-top--l margin-bottom--lg">
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <h2>
            Filters
            <button
              className={styles.operatorButton}
              onClick={toggleOperator}
              title={operator === 'OR' ? 'Change to AND' : 'Change to OR'}
            >
              {operator}
            </button>
          </h2>
        </div>
      </div>
      <ul className={clsx('clean-list', styles.tagList)}>
        {TagList.filter(tag => tag !== 'favorite').map((tag) => {
          const {label, description, color} = Tags[tag];
          return (
            <ShowcaseTagSelect
              key={tag}
              tag={tag}
              label={label}
              color={color}
              description={description}
              selected={selectedTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
            />
          );
        })}
      </ul>
    </section>
  );
}
