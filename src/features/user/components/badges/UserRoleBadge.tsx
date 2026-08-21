/* src/features/user/components/badges/UserRoleBadge.tsx */
import React from 'react';
import { Badge } from '../../../../shared/components/ui';
import styles from './UserRoleBadge.module.css';

interface Props {
  role?: string;
}

const roleMap: Record<string, { label: string; className: string }> = {
  admin: { label: 'Admin', className: styles.admin },
  user: { label: 'User', className: styles.user },
};

export const UserRoleBadge: React.FC<Props> = ({ role }) => {
  if (!role) return null;

  const config = roleMap[role.toLowerCase()] ?? { label: role, className: styles.user };

  return (
    <Badge
      shape="rounded"
      size="md"
      className={`${styles.roleBadge} ${config.className}`}
    >
      {config.label}
    </Badge>
  );
};