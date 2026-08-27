// src/features/households/settings/components/HouseholdSettingsButton.tsx
import React, { useState } from 'react';
import { Button, type ButtonProps } from '@/shared/components/ui';
import { HouseholdSettingsModal } from './HouseholdSettingsModal';

interface HouseholdSettingsButtonProps extends Omit<ButtonProps, 'children'> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const HouseholdSettingsButton: React.FC<HouseholdSettingsButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  title = 'Household Settings',
  onClick,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        title={title}
        onClick={handleClick}
        {...props}
      >
        ⚙️ Settings
      </Button>

      <HouseholdSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};