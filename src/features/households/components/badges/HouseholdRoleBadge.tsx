/* src/feature/households/components/HouseholdRoleBadge/HouseholdRoleBadge.tsx */
import React from 'react';
import { Badge, type BadgeProps } from '../../../../shared/components/ui';
import { type HouseholdRole } from '../../types/households.types';
import styles from './HouseholdRoleBadge.module.css';

export interface HouseholdRoleBadgeProps extends Omit<BadgeProps, 'children'> {
  role: HouseholdRole | string;
}

const roleMap: Record<string, { label: string; className: string }> = {
  owner: { label: 'Owner', className: styles.owner },
  editor: { label: 'Editor', className: styles.editor },
  member: { label: 'Member', className: styles.member },
};

export const HouseholdRoleBadge: React.FC<HouseholdRoleBadgeProps> = ({
  role,
  shape = 'pill', // domyślny kształt
  size = 'sm',    // domyślny rozmiar
  className = '',
  ...props
}) => {
  const config = roleMap[role] ?? { label: role, className: styles.member };

  return (
    <Badge
      shape={shape}
      size={size}
      className={`${config.className} ${className}`}
      {...props}
    >
      {config.label}
    </Badge>
  );
};