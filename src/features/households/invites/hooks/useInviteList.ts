// src/features/households/invites/hooks/useInvitesList.ts
import { useState, useCallback, useEffect } from 'react';
import { useInvites } from '@/features/households/invites/context/InvitesContext';

export const useInvitesList = () => {
  const { invites, isFetching, loadInvites } = useInvites();
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Automatyczne pobieranie bez synchronicznych setState wewnątrz efektu (Brak kaskadowych renderów)
  useEffect(() => {
    let isMounted = true;

    loadInvites().catch((err: any) => {
      if (isMounted) {
        setError(err.message || 'Nie udało się pobrać listy zaproszeń.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadInvites]);

  // Ręczna ponowna próba wywoływana zdarzeniem UI
  const reloadList = useCallback(async () => {
    setError(null);
    try {
      await loadInvites();
    } catch (err: any) {
      setError(err.message || 'Nie udało się pobrać listy zaproszeń.');
    }
  }, [loadInvites]);

  return {
    invites,
    isLoading: isFetching,
    error,
    reloadList,
    clearError,
  };
};