/* src/features/settings/components/SettingsButton.tsx */
import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { Button, type ButtonProps } from '../../../shared/components/ui';

interface SettingsButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  title = 'Settings',
  children = '⚙️ Settings',
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
        {children}
      </Button>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};