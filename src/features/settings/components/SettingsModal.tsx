/* src/shared/components/SettingsModal/SettingsModal.tsx */
import React, { useEffect } from 'react';
import { ThemeSelector } from '../theme/components/ThemeSelector';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
} from '../../../shared/components/ui';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className={styles.modalHeader}>
          <CardTitle>Ustawienia</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Zamknij"
          >
            ✕
          </Button>
        </CardHeader>

        <CardContent>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Motyw aplikacji</span>
              <span className={styles.settingDescription}>
                Wybierz wygląd interfejsu z dostępnej listy
              </span>
            </div>
          </div>

          <ThemeSelector />
        </CardContent>

        <CardFooter>
          <Button variant="primary" onClick={onClose}>
            Gotowe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};