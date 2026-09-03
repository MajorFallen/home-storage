// src/features/households/invites/hooks/useCreateInvite.ts
import { useState, useCallback } from 'react';
import { useInvites } from '@/features/households/invites/context/InvitesContext';
import { type CreateInviteDTO, type InviteCode } from '@/features/households/invites/types/invites.types';

export const useCreateInvite = () => {
  const { createInvite } = useInvites();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleCreate = useCallback(async (data: CreateInviteDTO): Promise<InviteCode | null> => {
    setIsCreating(true);
    setError(null);
    try {
      const newInvite = await createInvite(data);
      return newInvite;
    } catch (err: any) {
      setError(err.message || 'Nie udało się utworzyć zaproszenia.');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [createInvite]);

  return {
    createInvite: handleCreate,
    isCreating,
    error,
    clearError,
  };
};