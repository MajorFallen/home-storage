// src/features/households/invites/components/InviteMemberButton.tsx
import React, { useState } from 'react';
import { Button, type ButtonProps } from '@/shared/components/ui';
import { CreateInviteModal } from './CreateInviteModal';

interface InviteMemberButtonProps extends Omit<ButtonProps, 'children'> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const InviteMemberButton: React.FC<InviteMemberButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  title = 'Invite Member',
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
        + Invite Member
      </Button>

      <CreateInviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};