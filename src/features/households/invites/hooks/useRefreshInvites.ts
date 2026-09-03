// src/features/households/invites/hooks/useRefreshInvites.ts
import { useState, useCallback } from 'react';
import { useInvites } from '@/features/households/invites/context/InvitesContext';

export const useRefreshInvites = () => {
  const { refreshInvites, isFetching } = useInvites();
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleRefresh = useCallback(async () => {
    setError(null);
    try {
      await refreshInvites();
    } catch (err: any) {
      setError(err.message || 'Nie udało się odświeżyć listy zaproszeń.');
    }
  }, [refreshInvites]);

  return {
    refreshInvites: handleRefresh,
    isRefreshing: isFetching,
    error,
    clearError,
  };
};