// src/features/households/settings/components/HouseholdSettingsModal.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Modal, Button } from '@/shared/components/ui';
import { InvitesTab } from '../tabs/InvitesTab';

interface HouseholdSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HouseholdSettingsModal: React.FC<HouseholdSettingsModalProps> = ({
                                                                                  isOpen,
                                                                                  onClose,
                                                                              }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ustawienia domostwa"
            size="lg"
            footer={
                <Button variant="secondary" onClick={onClose}>
                    Zamknij
                </Button>
            }
        >
            <Tabs defaultValue="invites">
                <TabsList>
                    <TabsTrigger value="general">Ogólne</TabsTrigger>
                    <TabsTrigger value="members">Członkowie</TabsTrigger>
                    <TabsTrigger value="invites">Zaproszenia</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <div style={{ padding: '1rem', color: 'var(--surface-muted-foreground)' }}>
                        Ustawienia ogólne domostwa (w przygotowaniu)...
                    </div>
                </TabsContent>

                <TabsContent value="members">
                    <div style={{ padding: '1rem', color: 'var(--surface-muted-foreground)' }}>
                        Zarządzanie członkami domostwa (w przygotowaniu)...
                    </div>
                </TabsContent>

                <TabsContent value="invites">
                    <InvitesTab />
                </TabsContent>
            </Tabs>
        </Modal>
    );
};