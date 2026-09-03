// src/features/households/settings/components/tabs/InvitesTab/InvitesTab.tsx
import React from 'react';
import { TabPanel } from '@/shared/components/ui';
import { InvitesList } from '@/features/households/invites/components/invitesList/InvitesList';
import { CreateInviteButton } from '@/features/households/invites/components/CreateInviteButton';
import { InvitesRefreshButton } from '@/features/households/invites/components/InvitesRefreshButton';

export const InvitesTab: React.FC = () => {
  return (
    <TabPanel
      title="Household Invites"
      description="Manage active invite codes or generate new ones for family members."
      action={
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <InvitesRefreshButton />
          <CreateInviteButton />
        </div>
      }
    >
      <InvitesList maxHeight="450px" />
    </TabPanel>
  );
};