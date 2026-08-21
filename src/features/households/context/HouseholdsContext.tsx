// src/features/households/context/HouseholdsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { type HouseholdDTO } from '../types/households.types';
import { householdsService } from '../services/householdsService';
import { useAuth } from '../../auth/context/AuthContext';

interface HouseholdsContextType {
  households: HouseholdDTO[];
  activeHousehold: HouseholdDTO | null;
  isLoading: boolean;
  error: string | null;
  fetchHouseholds: () => Promise<void>;
  selectHousehold: (id: string | null) => void;
  createHousehold: (name: string) => Promise<boolean>;
  deleteHousehold: (id: string) => Promise<boolean>;
}

const HouseholdsContext = createContext<HouseholdsContextType | undefined>(undefined);

export const HouseholdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [households, setHouseholds] = useState<HouseholdDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Automatycznie wyliczamy activeHousehold, gdy zmieni się lista domostw lub selectedId
  const activeHousehold = useMemo(() => {
    if (!selectedId) return null;
    return households.find((h) => h.id === selectedId) || null;
  }, [households, selectedId]);

  // 1. Pobieranie listy domostw z serwisu
  const fetchHouseholds = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await householdsService.getHouseholds();
      setHouseholds(data);
    } catch (err: any) {
      setError(err.message || 'Błąd podczas pobierania domostw.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 2. Automatyczne pobranie po zweryfikowaniu zalogowania
  useEffect(() => {
    if (isAuthenticated) {
      fetchHouseholds();
    } else {
      setHouseholds([]);
      setSelectedId(null);
    }
  }, [isAuthenticated, fetchHouseholds]);

  // 3. Wybór aktywnego domostwa
  const selectHousehold = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  // 4. Tworzenie domostwa
  const createHousehold = async (name: string): Promise<boolean> => {
    try {
      setError(null);
      await householdsService.createHousehold(name);
      await fetchHouseholds(); // Odświeżamy listę po sukcesie
      return true;
    } catch (err: any) {
      setError(err.message || 'Błąd podczas tworzenia domostwa.');
      return false;
    }
  };

  // 5. Usuwanie domostwa
  const deleteHousehold = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await householdsService.deleteHousehold(id);
      
      // Aktualizujemy stan lokalnie bez dodatkowego zapytania GET
      setHouseholds((prev) => prev.filter((item) => item.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Błąd podczas usuwania domostwa.');
      return false;
    }
  };

  return (
    <HouseholdsContext.Provider
      value={{
        households,
        activeHousehold,
        isLoading,
        error,
        fetchHouseholds,
        selectHousehold,
        createHousehold,
        deleteHousehold,
      }}
    >
      {children}
    </HouseholdsContext.Provider>
  );
};

export const useHouseholds = () => {
  const context = useContext(HouseholdsContext);
  if (!context) {
    throw new Error('useHouseholds musi być użyty wewnątrz HouseholdsProvider');
  }
  return context;
};