// src/features/households/invites/context/InvitesContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { invitesService } from '@/features/households/invites/services/invitesService';
import { useHouseholds } from '@/features/households/context/HouseholdsContext';
import { 
  type InviteCode, 
  type CreateInviteDTO, 
  type JoinInviteResponse 
} from '@/features/households/invites/types/invites.types';

interface InvitesContextType {
  invites: InviteCode[];
  isFetching: boolean; // Stan pobierania/odświeżania cache dla aktywnego domostwa
  loadInvites: () => Promise<void>;
  refreshInvites: () => Promise<void>;
  createInvite: (data: CreateInviteDTO) => Promise<InviteCode>;
  deleteInvite: (inviteId: string) => Promise<boolean>;
  joinHousehold: (code: string) => Promise<JoinInviteResponse['household']>;
}

const InvitesContext = createContext<InvitesContextType | undefined>(undefined);

export const InvitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeHousehold, fetchHouseholds, selectHousehold } = useHouseholds();

  // Cache gotowych danych: { [householdId]: InviteCode[] }
  const [invitesByHousehold, setInvitesByHousehold] = useState<Record<string, InviteCode[]>>({});

  // Stan trwającego pobierania/odświeżania: { [householdId]: boolean }
  const [fetchingByHousehold, setFetchingByHousehold] = useState<Record<string, boolean>>({});

  // Synchronizacja ref.current dla gotowego cache (Zasada 4: tylko w useEffect)
  const invitesByHouseholdRef = useRef(invitesByHousehold);
  useEffect(() => {
    invitesByHouseholdRef.current = invitesByHousehold;
  }, [invitesByHousehold]);

  // Mapa trwających żądań (In-Flight Promises) dla deduplikacji zapytań
  const inFlightRequestsRef = useRef<Record<string, Promise<InviteCode[]> | undefined>>({});

  // Wartość pochodna: lista zaproszeń dla aktywnego domostwa
  const invites = useMemo(() => {
    if (!activeHousehold) return [];
    return invitesByHousehold[activeHousehold.id] || [];
  }, [activeHousehold?.id, invitesByHousehold]);

  // Wartość pochodna: czy trwa pobieranie/odświeżanie dla aktywnego domostwa
  const isFetching = useMemo(() => {
    if (!activeHousehold) return false;
    return !!fetchingByHousehold[activeHousehold.id];
  }, [activeHousehold?.id, fetchingByHousehold]);

  // Wewnętrzna funkcja pomocnicza zarządzająca wskaźnikiem fetching
  const executeFetch = useCallback(async (householdId: string): Promise<InviteCode[]> => {
    setFetchingByHousehold((prev) => ({ ...prev, [householdId]: true }));
    try {
      const data = await invitesService.getInvites(householdId);
      setInvitesByHousehold((prev) => ({
        ...prev,
        [householdId]: data,
      }));
      return data;
    } finally {
      setFetchingByHousehold((prev) => ({ ...prev, [householdId]: false }));
    }
  }, []);

  // 1. Ładowanie z obsługą cache oraz deduplikacją żądań
  const loadInvites = useCallback(async () => {
    if (!activeHousehold) return;
    const householdId = activeHousehold.id;

    // A. Jeśli dane są już w cache – nic nie robimy
    if (invitesByHouseholdRef.current[householdId] !== undefined) {
      return;
    }

    // B. Jeśli żądanie dla tego householdId JUŻ LECI – podpinamy się pod istniejącą Obietnicę
    if (inFlightRequestsRef.current[householdId]) {
      await inFlightRequestsRef.current[householdId];
      return;
    }

    // C. Tworzymy nowe żądanie
    const requestPromise = executeFetch(householdId);
    inFlightRequestsRef.current[householdId] = requestPromise;

    try {
      await requestPromise;
    } finally {
      inFlightRequestsRef.current[householdId] = undefined;
    }
  }, [activeHousehold?.id, executeFetch]);

  // 2. Wymuszone odświeżenie z serwera (np. wywołane z InvitesRefreshButton)
  const refreshInvites = useCallback(async () => {
    if (!activeHousehold) return;
    const householdId = activeHousehold.id;

    // Jeśli odświeżanie już trwa, podpinamy się pod istniejące żądanie
    if (inFlightRequestsRef.current[householdId]) {
      await inFlightRequestsRef.current[householdId];
      return;
    }

    const requestPromise = executeFetch(householdId);
    inFlightRequestsRef.current[householdId] = requestPromise;

    try {
      await requestPromise;
    } finally {
      inFlightRequestsRef.current[householdId] = undefined;
    }
  }, [activeHousehold?.id, executeFetch]);

  // 3. Tworzenie zaproszenia
  const createInvite = useCallback(async (data: CreateInviteDTO) => {
    if (!activeHousehold) {
      throw new Error('Brak wybranego domostwa.');
    }
    const householdId = activeHousehold.id;
    const newInvite = await invitesService.createInvite(householdId, data);

    setInvitesByHousehold((prev) => ({
      ...prev,
      [householdId]: [newInvite, ...(prev[householdId] || [])],
    }));

    return newInvite;
  }, [activeHousehold?.id]);

  // 4. Usuwanie zaproszenia
  const deleteInvite = useCallback(async (inviteId: string) => {
    if (!activeHousehold) {
      throw new Error('Brak wybranego domostwa.');
    }
    const householdId = activeHousehold.id;
    const success = await invitesService.deleteInvite(householdId, inviteId);

    if (success) {
      setInvitesByHousehold((prev) => ({
        ...prev,
        [householdId]: (prev[householdId] || []).filter((inv) => inv.id !== inviteId),
      }));
    }
    return success;
  }, [activeHousehold?.id]);

  // 5. Dołączanie do domostwa za pomocą kodu
  const joinHousehold = useCallback(async (code: string) => {
    const joinedHousehold = await invitesService.joinHousehold(code);
    await fetchHouseholds();
    selectHousehold(joinedHousehold.id);
    return joinedHousehold;
  }, [fetchHouseholds, selectHousehold]);

  return (
    <InvitesContext.Provider
      value={{
        invites,
        isFetching,
        loadInvites,
        refreshInvites,
        createInvite,
        deleteInvite,
        joinHousehold,
      }}
    >
      {children}
    </InvitesContext.Provider>
  );
};

export const useInvites = (): InvitesContextType => {
  const contextValue = useContext(InvitesContext);
  if (!contextValue) {
    throw new Error('useInvites musi być użyty wewnątrz InvitesProvider');
  }
  return contextValue;
};