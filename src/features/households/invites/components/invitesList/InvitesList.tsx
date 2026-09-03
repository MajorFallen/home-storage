// src/features/households/invites/components/invitesList/InvitesList.tsx
import React from 'react';
import { ScrollArea, Alert } from '@/shared/components/ui';
import { useInvitesList } from '@/features/households/invites/hooks/useInviteList';
import { useDeleteInvite } from '@/features/households/invites/hooks/useDeleteInvites';
import { InviteCodeItem } from './InviteCodeItem';

interface InvitesListProps {
  maxHeight?: string | number;
}

export const InvitesList: React.FC<InvitesListProps> = ({ maxHeight = '420px' }) => {
  const { invites, isLoading, error: listError } = useInvitesList();
  const { deleteInvite, deletingId, error: deleteError } = useDeleteInvite();

  // Błąd pobierania całej listy blokuje widok listy
  if (listError) {
    return (
      <Alert type="error" title="Błąd zaproszeń">
        {listError}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Błąd usuwania wyświetla się jako powiadomienie bez blokowania całej listy */}
      {deleteError && (
        <Alert type="error" title="Nie udało się usunąć">
          {deleteError}
        </Alert>
      )}

      <ScrollArea
        maxHeight={maxHeight}
        isLoading={isLoading && invites.length === 0}
        isEmpty={!isLoading && invites.length === 0}
        loadingMessage="Wczytywanie aktywnych zaproszeń..."
        emptyMessage="Brak aktywnych zaproszeń dla tego domostwa."
      >
        {invites.map((invite) => (
          <InviteCodeItem
            key={invite.id}
            invite={invite}
            onDelete={deleteInvite}
            isDeleting={deletingId === invite.id}
          />
        ))}
      </ScrollArea>
    </div>
  );
};