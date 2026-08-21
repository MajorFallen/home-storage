/* src/shared/components/ui/Toggle/Toggle.tsx */
import React from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  size?: 'sm' | 'md';
  thumbIcon?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  disabled = false,
  thumbIcon,
  className = '',
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const containerClasses = [
    styles.container,
    styles[size],
    checked ? styles.checked : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={containerClasses}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={styles.track}
        {...props}
      >
        <span className={styles.thumb}>{thumbIcon}</span>
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};