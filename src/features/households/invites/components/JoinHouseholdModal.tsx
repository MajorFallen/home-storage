import React, { useState } from 'react';
import { Modal, Input, Button } from '@/shared/components/ui';
import { useInvites } from '../context/InvitesContext';
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
  
  // Zmiana acceptInvite -> joinHousehold (zgodnie z nazwą w InvitesContext)
  const { joinHousehold, isLoading, error, clearError } = useInvites();

  const handleClose = () => {
    setInviteCode('');
    clearError?.();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCode.trim();
    
    if (!cleanCode) return;

    try {
      await joinHousehold(cleanCode);
      handleClose();
      onSuccess?.();
    } catch (err) {
      console.error('Błąd podczas dołączania do domostwa:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Join Household"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="join-household-form"
            variant="primary"
            disabled={isLoading || !inviteCode.trim()}
          >
            {isLoading ? 'Joining...' : 'Join'}
          </Button>
        </>
      }
    >
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form id="join-household-form" onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="inviteCode"
          label="Invitation Code"
          placeholder="Enter invitation code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          disabled={isLoading}
          required
        />
      </form>
    </Modal>
  );
};