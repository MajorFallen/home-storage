// src/features/households/invites/components/InvitesRefreshButton.tsx
import React from 'react';
import { Button, type ButtonProps } from '@/shared/components/ui';
import { useRefreshInvites } from '@/features/households/invites/hooks/useRefreshInvites';

export interface InvitesRefreshButtonProps {
  /** Visual variant of the button from UI Kit */
  variant?: ButtonProps['variant'];
  /** Size variant of the button */
  size?: ButtonProps['size'];
  /** Optional custom text label. If false, renders an icon-only button */
  showLabel?: boolean;
  /** Optional callback fired upon successful refresh */
  onSuccess?: () => void;
  /** Optional CSS class name for positioning */
  className?: string;
}

export const InvitesRefreshButton: React.FC<InvitesRefreshButtonProps> = ({
  variant = 'secondary',
  size = 'sm',
  showLabel = true,
  onSuccess,
  className,
}) => {
  const { refreshInvites, isRefreshing } = useRefreshInvites();

  const handleRefresh = async () => {
    await refreshInvites();
    onSuccess?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      isLoading={isRefreshing}
      disabled={isRefreshing}
      className={className}
      aria-label="Refresh invite codes"
    >
      {showLabel ? 'Refresh' : undefined}
    </Button>
  );
};