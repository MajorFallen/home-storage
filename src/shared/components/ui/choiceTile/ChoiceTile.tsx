/* src/shared/components/ui/ChoiceTile/ChoiceTile.tsx */
import React from 'react';
import styles from './ChoiceTile.module.css';

export interface ChoiceTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  showIndicator?: boolean;
  children: React.ReactNode;
}

export const ChoiceTile: React.FC<ChoiceTileProps> = ({
  selected = false,
  showIndicator = true,
  children,
  className = '',
  role = 'radio',
  ...props
}) => {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      className={`${styles.tile} ${selected ? styles.selected : ''} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {selected && showIndicator && <span className={styles.indicator}/>}
    </button>
  );
};