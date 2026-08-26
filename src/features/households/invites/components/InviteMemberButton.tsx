// src/features/households/invites/components/InviteMemberButton.tsx
import React from 'react';
import { Button, type ButtonProps } from '../../../../shared/components/ui';

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
  return (
    <Button
      variant={variant}
      size={size}
      title={title}
      onClick={onClick}
      {...props}
    >
      + Invite Member
    </Button>
  );
};