import React, { useState } from 'react';
import { Modal, Button, Input } from '@/shared/components/ui';
import { useInvites } from '../context/InvitesContext';
import { type InviteCode } from '../types/invites.types';
import styles from './CreateInviteModal.module.css';

export interface CreateInvitePayload {
  maxUses: number | null;     
  expiresInDays: number | null; 
}

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInvite?: (payload: CreateInvitePayload) => void;
}

type ExpirationPreset = '1' | '7' | '30' | 'never';
type MaxUsesPreset = '1' | '5' | 'unlimited' | 'custom';

export const CreateInviteModal: React.FC<CreateInviteModalProps> = ({
  isOpen,
  onClose,
  onSubmitInvite,
}) => {
  const { createInvite, isLoading, error, clearError } = useInvites();

  const [expirationMode, setExpirationMode] = useState<ExpirationPreset>('7');
  const [maxUsesMode, setMaxUsesMode] = useState<MaxUsesPreset>('1');
  const [customMaxUses, setCustomMaxUses] = useState<number>(25);

  // Stan dla wygenerowanego kodu i statusu kopiowania
  const [createdInvite, setCreatedInvite] = useState<InviteCode | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Resetuje stan modala przy zamknięciu
  const handleClose = () => {
    setCreatedInvite(null);
    setCopied(false);
    clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateInvitePayload = {
      expiresInDays: expirationMode === 'never' ? null : parseInt(expirationMode, 10),
      maxUses:
        maxUsesMode === 'unlimited'
          ? null
          : maxUsesMode === 'custom'
          ? customMaxUses > 0 ? customMaxUses : 1
          : parseInt(maxUsesMode, 10),
    };

    try {
      const newInvite = await createInvite(payload);
      setCreatedInvite(newInvite);
      onSubmitInvite?.(payload);
    } catch {
      // Błąd jest automatycznie obsługiwany przez InvitesContext (stan error)
    }
  };

  const handleCopyCode = async () => {
    if (!createdInvite?.code) return;
    
    try {
      await navigator.clipboard.writeText(createdInvite.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować kodu do schowka:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdInvite ? "Invitation Code Generated" : "Create Invitation Code"}
      size="md"
      footer={
        createdInvite ? (
          <Button type="button" variant="primary" onClick={handleClose}>
            Done
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" form="create-invite-form" variant="primary" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate invite code'}
            </Button>
          </>
        )
      }
    >
      {error && <div className={styles.errorMessage}>{error}</div>}

      {createdInvite ? (
        /* WIDOK SUKCESU - Pokazanie kodu i kopiowanie */
        <div className={styles.successSection}>
          <p className={styles.successDescription}>
            Your invitation code is ready! Share this code with people you want to join your household.
          </p>

          <div className={styles.codeContainer}>
            <span className={styles.codeDisplay}>{createdInvite.code}</span>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCopyCode}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      ) : (
        /* FORMULARZ GENEROWANIA KODU */
        <form id="create-invite-form" onSubmit={handleSubmit} className={styles.form}>
          {/* Expiration Time */}
          <div className={styles.section}>
            <label className={styles.label}>Expiration Time</label>
            <div className={styles.optionsGrid}>
              <button
                type="button"
                className={`${styles.optionBtn} ${expirationMode === '1' ? styles.active : ''}`}
                onClick={() => setExpirationMode('1')}
              >
                1 Day
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${expirationMode === '7' ? styles.active : ''}`}
                onClick={() => setExpirationMode('7')}
              >
                7 Days (One week)
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${expirationMode === '30' ? styles.active : ''}`}
                onClick={() => setExpirationMode('30')}
              >
                30 Days
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${expirationMode === 'never' ? styles.active : ''}`}
                onClick={() => setExpirationMode('never')}
              >
                Never (Forever)
              </button>
            </div>
          </div>

          {/* Max Uses */}
          <div className={styles.section}>
            <label className={styles.label}>Max Uses</label>
            <div className={styles.optionsGrid}>
              <button
                type="button"
                className={`${styles.optionBtn} ${maxUsesMode === '1' ? styles.active : ''}`}
                onClick={() => setMaxUsesMode('1')}
              >
                1 Use
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${maxUsesMode === '5' ? styles.active : ''}`}
                onClick={() => setMaxUsesMode('5')}
              >
                5 Uses
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${maxUsesMode === 'unlimited' ? styles.active : ''}`}
                onClick={() => setMaxUsesMode('unlimited')}
              >
                ∞ Unlimited
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${maxUsesMode === 'custom' ? styles.active : ''}`}
                onClick={() => setMaxUsesMode('custom')}
              >
                Custom...
              </button>
            </div>

            {maxUsesMode === 'custom' && (
              <div className={styles.customInputContainer}>
                <Input
                  type="number"
                  min={1}
                  label="Custom number of uses"
                  value={customMaxUses}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomMaxUses(parseInt(e.target.value, 10) || 1)
                  }
                  required
                />
              </div>
            )}
          </div>
        </form>
      )}
    </Modal>
  );