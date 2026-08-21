/* src/features/auth/components/LogoutButton.tsx */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, type ButtonProps } from '../../../shared/components/ui';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  // Możesz nadpisać dowolny prop bazowego Buttona (variant, size, disabled, etc.)
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  children = 'Log out',
  ...props
}) => {
  const { logout } = useAuth();

  return (
    <Button variant={variant} size={size} onClick={logout} {...props}>
      {children}
    </Button>
  );
};