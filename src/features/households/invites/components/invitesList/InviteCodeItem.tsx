// src/features/households/invites/components/invitesList/InviteCodeItem.tsx
import React from 'react';
import { type InviteCode } from '@/features/households/invites/types/invites.types';
import { Card, CardContent, Button, CopyableCode } from '@/shared/components/ui';
import styles from './InviteCodeItem.module.css';

interface InviteCodeItemProps {
  invite: InviteCode;
  onDelete: (id: string) => Promise<boolean> | void;
  isDeleting?: boolean;
}

export const InviteCodeItem: React.FC<InviteCodeItemProps> = ({
  invite,
  onDelete,
  isDeleting = false,
}) => {
  const handleDelete = () => {
    onDelete(invite.id);
  };

  const formattedExpiry = invite.expires_at
    ? new Date(invite.expires_at).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Brak (Nigdy)';

  const usageLabel =
    invite.max_uses !== null
      ? `${invite.uses_count} / ${invite.max_uses}`
      : `${invite.uses_count} (Bez limitu)`;

  return (
    <Card variant="outlined" className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div className={styles.mainInfo}>
          <CopyableCode code={invite.code}/>

          <div className={styles.metaInfo}>
            <span className={styles.metaLabel}>
              Użycia: <strong>{usageLabel}</strong>
            </span>
            <span className={styles.metaLabel}>
              Ważność: <strong>{formattedExpiry}</strong>
            </span>
            {invite.created_by_name && (
              <span className={styles.metaLabel}>
                Autor: <strong>{invite.created_by_name}</strong>
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost-danger"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
          disabled={isDeleting}
          aria-label="Usuń kod zaproszenia"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};