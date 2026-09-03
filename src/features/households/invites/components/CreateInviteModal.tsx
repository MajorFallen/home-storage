// src/features/households/invites/components/CreateInviteModal.tsx
import React, { useState } from 'react';
import { Modal, Button, Input, Alert, ChoiceTile, CopyableCode } from '@/shared/components/ui';
import { useCreateInvite } from '@/features/households/invites/hooks/useCreateInvite';
import { type InviteCode, type CreateInviteDTO } from '@/features/households/invites/types/invites.types';
import styles from './CreateInviteModal.module.css';

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInvite?: (payload: CreateInviteDTO) => void;
}

type ExpirationPreset = '1' | '7' | '30' | 'never';
type MaxUsesPreset = '1' | '5' | 'unlimited' | 'custom';

export const CreateInviteModal: React.FC<CreateInviteModalProps> = ({
  isOpen,
  onClose,
  onSubmitInvite,
}) => {
  const { createInvite, isCreating, error, clearError } = useCreateInvite();

  const [expirationMode, setExpirationMode] = useState<ExpirationPreset>('7');
  const [maxUsesMode, setMaxUsesMode] = useState<MaxUsesPreset>('1');
  const [customMaxUses, setCustomMaxUses] = useState<number>(25);

  const [createdInvite, setCreatedInvite] = useState<InviteCode | null>(null);

  const handleClose = () => {
    setCreatedInvite(null);
    clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateInviteDTO = {
      expiresInDays: expirationMode === 'never' ? null : parseInt(expirationMode, 10),
      maxUses:
        maxUsesMode === 'unlimited'
          ? null
          : maxUsesMode === 'custom'
          ? customMaxUses > 0 ? customMaxUses : 1
          : parseInt(maxUsesMode, 10),
    };

    const newInvite = await createInvite(payload);
    if (newInvite) {
      setCreatedInvite(newInvite);
      onSubmitInvite?.(payload);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdInvite ? "Wygenerowano kod zaproszenia" : "Utwórz kod zaproszenia"}
      size="md"
      footer={
        createdInvite ? (
          <Button type="button" variant="primary" onClick={handleClose}>
            Gotowe
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isCreating}>
              Anuluj
            </Button>
            <Button type="submit" form="create-invite-form" variant="primary" isLoading={isCreating}>
              Wygeneruj kod
            </Button>
          </>
        )
      }
    >
      <div className={styles.container}>
        {error && (
          <Alert type="error" title="Błąd tworzenia zaproszenia">
            {error}
          </Alert>
        )}

        {createdInvite ? (
          /* WIDOK SUKCESU */
          <div className={styles.successSection}>
            <p className={styles.successDescription}>
              Twój kod zaproszenia jest gotowy! Udostępnij go osobie, którą chcesz zaprosić do domostwa.
            </p>
            <CopyableCode code={createdInvite.code}/>
          </div>
        ) : (
          /* FORMULARZ GENEROWANIA KODU */
          <form id="create-invite-form" onSubmit={handleSubmit} className={styles.form}>
            {/* Czas wygasania */}
            <div className={styles.section}>
              <label className={styles.label}>Czas ważności</label>
              <div className={styles.optionsGrid}>
                <ChoiceTile
                  selected={expirationMode === '1'}
                  onClick={() => setExpirationMode('1')}
                  disabled={isCreating}
                >
                  1 dzień
                </ChoiceTile>
                <ChoiceTile
                  selected={expirationMode === '7'}
                  onClick={() => setExpirationMode('7')}
                  disabled={isCreating}
                >
                  7 dni (tydzień)
                </ChoiceTile>
                <ChoiceTile
                  selected={expirationMode === '30'}
                  onClick={() => setExpirationMode('30')}
                  disabled={isCreating}
                >
                  30 dni
                </ChoiceTile>
                <ChoiceTile
                  selected={expirationMode === 'never'}
                  onClick={() => setExpirationMode('never')}
                  disabled={isCreating}
                >
                  Nigdy (bez limitu)
                </ChoiceTile>
              </div>
            </div>

            {/* Maksymalna liczba użyć */}
            <div className={styles.section}>
              <label className={styles.label}>Maksymalna liczba użyć</label>
              <div className={styles.optionsGrid}>
                <ChoiceTile
                  selected={maxUsesMode === '1'}
                  onClick={() => setMaxUsesMode('1')}
                  disabled={isCreating}
                >
                  1 użycie
                </ChoiceTile>
                <ChoiceTile
                  selected={maxUsesMode === '5'}
                  onClick={() => setMaxUsesMode('5')}
                  disabled={isCreating}
                >
                  5 użyć
                </ChoiceTile>
                <ChoiceTile
                  selected={maxUsesMode === 'unlimited'}
                  onClick={() => setMaxUsesMode('unlimited')}
                  disabled={isCreating}
                >
                  ∞ Bez limitu
                </ChoiceTile>
                <ChoiceTile
                  selected={maxUsesMode === 'custom'}
                  onClick={() => setMaxUsesMode('custom')}
                  disabled={isCreating}
                >
                  Własna...
                </ChoiceTile>
              </div>

              {maxUsesMode === 'custom' && (
                <div className={styles.customInputContainer}>
                  <Input
                    type="number"
                    min={1}
                    label="Liczba użyć"
                    value={customMaxUses}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomMaxUses(parseInt(e.target.value, 10) || 1)
                    }
                    disabled={isCreating}
                    required
                  />
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};