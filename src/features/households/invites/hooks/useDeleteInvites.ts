// src/features/households/invites/hooks/useDeleteInvite.ts
import { useState, useCallback } from 'react';
import { useInvites } from '@/features/households/invites/context/InvitesContext';

export const useDeleteInvite = () => {
  const { deleteInvite } = useInvites();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleDelete = useCallback(async (inviteId: string): Promise<boolean> => {
    setDeletingId(inviteId);
    setError(null);
    try {
      const success = await deleteInvite(inviteId);
      return success;
    } catch (err: any) {
      setError(err.message || 'Nie udało się usunąć zaproszenia.');
      return false;
    } finally {
      setDeletingId(null);
    }
  }, [deleteInvite]);

  return {
    deleteInvite: handleDelete,
    isDeleting: deletingId !== null,
    deletingId,
    error,
    clearError,
  };
};