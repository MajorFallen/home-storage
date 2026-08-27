import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { invitesService } from '../services/invitesService';
import { useHouseholds } from '../../context/HouseholdsContext';
import { 
  type InviteCode, 
  type CreateInviteDTO, 
  type JoinInviteResponse 
} from '../types/invites.types';

interface InvitesContextType {
  invites: InviteCode[];
  isLoading: boolean;
  error: string | null;
  loadInvites: () => Promise<void>;     // Pobiera tylko jeśli brak w cache
  refreshInvites: () => Promise<void>;  // Wymusza pobranie z serwera (np. przycisk Odśwież)
  createInvite: (data: CreateInviteDTO) => Promise<InviteCode>;
  deleteInvite: (inviteId: string) => Promise<boolean>;
  joinHousehold: (code: string) => Promise<JoinInviteResponse['household']>;
  clearError: () => void;
}

const InvitesContext = createContext<InvitesContextType | undefined>(undefined);

export const InvitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeHousehold, fetchHouseholds, selectHousehold } = useHouseholds();

  // Cache: { [householdId]: InviteCode[] }
  const [invitesByHousehold, setInvitesByHousehold] = useState<Record<string, InviteCode[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Wartość pochodna: lista zaproszeń dla aktywnego domostwa
  const invites = useMemo(() => {
    if (!activeHousehold) return [];
    return invitesByHousehold[activeHousehold.id] || [];
  }, [activeHousehold?.id, invitesByHousehold]);

  // Wewnętrzna funkcja pomocnicza do pobierania danych z API
  const fetchFromApi = useCallback(async (householdId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invitesService.getInvites(householdId);
      setInvitesByHousehold((prev) => ({
        ...prev,
        [householdId]: data,
      }));
    } catch (err: any) {
      setError(err.message || 'Nie udało się pobrać listy zaproszeń.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Ładowanie z obsługą cache (dla useEffect w komponentach)
  const loadInvites = useCallback(async () => {
    if (!activeHousehold) return;

    const householdId = activeHousehold.id;

    // Jeśli dane są już w cache - nie strzelamy do API
    if (invitesByHousehold[householdId] !== undefined) {
      return;
    }

    await fetchFromApi(householdId);
  }, [activeHousehold?.id, invitesByHousehold, fetchFromApi]);

  // 2. Wymuszone odświeżenie z serwera (np. dla przycisku "Odśwież")
  const refreshInvites = useCallback(async () => {
    if (!activeHousehold) return;
    await fetchFromApi(activeHousehold.id);
  }, [activeHousehold?.id, fetchFromApi]);

  // 3. Tworzenie zaproszenia
  const createInvite = useCallback(async (data: CreateInviteDTO) => {
    if (!activeHousehold) {
      throw new Error('Brak wybranego domostwa.');
    }

    const householdId = activeHousehold.id;
    setIsLoading(true);
    setError(null);
    try {
      const newInvite = await invitesService.createInvite(householdId, data);
      
      setInvitesByHousehold((prev) => ({
        ...prev,
        [householdId]: [newInvite, ...(prev[householdId] || [])],
      }));

      return newInvite;
    } catch (err: any) {
      const msg = err.message || 'Nie udało się utworzyć zaproszenia.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeHousehold?.id]);

  // 4. Usuwanie zaproszenia
  const deleteInvite = useCallback(async (inviteId: string) => {
    if (!activeHousehold) {
      throw new Error('Brak wybranego domostwa.');
    }

    const householdId = activeHousehold.id;
    setIsLoading(true);
    setError(null);
    try {
      const success = await invitesService.deleteInvite(householdId, inviteId);
      if (success) {
        setInvitesByHousehold((prev) => ({
          ...prev,
          [householdId]: (prev[householdId] || []).filter((inv) => inv.id !== inviteId),
        }));
      }
      return success;
    } catch (err: any) {
      const msg = err.message || 'Nie udało się usunąć zaproszenia.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeHousehold?.id]);

  // 5. Dołączanie do domostwa za pomocą kodu
  const joinHousehold = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const joinedHousehold = await invitesService.joinHousehold(code);

      await fetchHouseholds();
      selectHousehold(joinedHousehold.id);

      return joinedHousehold;
    } catch (err: any) {
      const msg = err.message || 'Nie udało się dołączyć do domostwa.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchHouseholds, selectHousehold]);

  return (
    <InvitesContext.Provider
      value={{
        invites,
        isLoading,
        error,
        loadInvites,
        refreshInvites,
        createInvite,
        deleteInvite,
        joinHousehold,
        clearError,
      }}
    >
      {children}
    </InvitesContext.Provider>
  );
};

export const useInvites = (): InvitesContextType => {
  const context = useContext(InvitesContext);
  if (!context) {
    throw new Error('useInvites musi być użyty wewnątrz InvitesProvider');
  }
  return context;
};