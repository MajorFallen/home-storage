import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui';
import { JoinHouseholdModal } from '../modals/JoinHouseholdModal';

export const JoinHouseholdAction: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        Join Household
      </Button>

      <JoinHouseholdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};