// src/features/households/invites/components/JoinHouseholdModal.tsx
import React, { useState } from 'react';
import { Modal, Input, Button, Alert } from '@/shared/components/ui';
import { useJoinHousehold } from '@/features/households/invites/hooks/useJoinHousehold';
import styles from './JoinHouseholdModal.module.css';

interface JoinHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JoinHouseholdModal: React.FC<JoinHouseholdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const { joinHousehold, isJoining, error, clearError } = useJoinHousehold();

  const handleClose = () => {
    setInviteCode('');
    clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCode.trim();
    if (!cleanCode) return;

    const joinedHousehold = await joinHousehold(cleanCode);
    if (joinedHousehold) {
      handleClose();
      onSuccess?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dołącz do domostwa"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isJoining}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            form="join-household-form"
            variant="primary"
            isLoading={isJoining}
            disabled={!inviteCode.trim()}
          >
            Dołącz
          </Button>
        </>
      }
    >
      <div className={styles.container}>
        {error && (
          <Alert type="error" title="Błąd dołączania">
            {error}
          </Alert>
        )}

        <form id="join-household-form" onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="inviteCode"
            label="Kod zaproszenia"
            placeholder="Wprowadź kod zaproszenia"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            disabled={isJoining}
            required
          />
        </form>
      </div>
    </Modal>
  );
};