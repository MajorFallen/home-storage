import React, { useState } from 'react';
import { Modal, Input, Button } from '../../../../shared/components/ui';

interface JoinHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinHouseholdModal: React.FC<JoinHouseholdModalProps> = ({ isOpen, onClose }) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tutaj trafi logika dołączania
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Household"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="join-household-form" variant="primary">
            Join
          </Button>
        </>
      }
    >
      <form id="join-household-form" onSubmit={handleSubmit}>
        <Input
          id="inviteCode"
          label="Invitation Code"
          placeholder="Enter invitation code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
      </form>
    </Modal>
  );
};