// src/features/households/invites/hooks/useJoinHousehold.ts
import { useState, useCallback } from 'react';
import { useInvites } from '../context/InvitesContext';
import { type JoinInviteResponse } from '../types/invites.types';

export const useJoinHousehold = () => {
  const { joinHousehold } = useInvites();
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleJoin = useCallback(async (code: string): Promise<JoinInviteResponse['household'] | null> => {
    setIsJoining(true);
    setError(null);
    try {
      const household = await joinHousehold(code);
      return household;
    } catch (err: any) {
      setError(err.message || 'Nie udało się dołączyć do domostwa.');
      return null;
    } finally {
      setIsJoining(false);
    }
  }, [joinHousehold]);

  return {
    joinHousehold: handleJoin,
    isJoining,
    error,
    clearError,
  };
};