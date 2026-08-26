import React, { useState } from 'react';
import { Modal, Button } from '../../../../shared/components/ui';
import styles from './HouseholdSettingsModal.module.css';

interface HouseholdSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'general' | 'members' | 'invites';

export const HouseholdSettingsModal: React.FC<HouseholdSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Household Settings"
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className={styles.tabsHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'members' ? styles.active : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members & Requests
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'invites' ? styles.active : ''}`}
          onClick={() => setActiveTab('invites')}
        >
          Invites
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'general' && (
          <div>
            <p>Zarządzanie nazwą domostwa oraz opcja usunięcia.</p>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <p>Lista członków domostwa oraz oczekujące prośby o dołączenie.</p>
          </div>
        )}

        {activeTab === 'invites' && (
          <div>
            <p>Tabela aktywnych kodów zaproszeń oraz generator nowych kodów.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};