import React from 'react';
import { ThemeSelector } from '../theme/components/ThemeSelector';
import { Modal, Button } from '../../../shared/components/ui';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      footer={
        <Button variant="primary" onClick={onClose}>
          Gotowe
        </Button>
      }
    >
      <div className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <span className={styles.settingLabel}>Motyw aplikacji</span>
          <span className={styles.settingDescription}>
            Wybierz wygląd interfejsu z dostępnej listy
          </span>
        </div>
      </div>

      <ThemeSelector />
    </Modal>
  );
};