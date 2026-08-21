/* src/shared/components/ui/Badge/Badge.tsx */
import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  shape?: 'pill' | 'rounded';
  size?: 'sm' | 'md' | 'lg' ;
}

export const Badge: React.FC<BadgeProps> = ({
  shape = 'pill',
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  const badgeClasses = [
    styles.badge,
    styles[shape],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};