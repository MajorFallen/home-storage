/* src/features/user/components/UserHeader.tsx */
import React from 'react';
import { useUser } from '../context/UserContext';
import { LogoutButton } from '../../auth/components/LogoutButton';
import { SettingsButton } from '../../settings/components/SettingsButton';
import { UserRoleBadge } from './badges/UserRoleBadge';
import { PageHeader } from '../../../shared/components/ui';

export const UserHeader: React.FC = () => {
  const { user } = useUser();

  return (
    <PageHeader layout="row">
      <PageHeader.Group>
        {user?.name && <PageHeader.Text>{user.name}</PageHeader.Text>}
        {user?.email && <PageHeader.Muted>({user.email})</PageHeader.Muted>}
        <UserRoleBadge role={user?.role} />
      </PageHeader.Group>

      <PageHeader.Actions>
        <SettingsButton />
        <LogoutButton />
      </PageHeader.Actions>
    </PageHeader>
  );
};