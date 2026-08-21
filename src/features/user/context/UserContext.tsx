// src/features/user/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type UserDTO } from '../types/user.types';
import { userService } from '../services/userService';
import { useAuth } from '../../auth/context/AuthContext'

interface UserContextType {
  user: UserDTO | null;
  isUserLoading: boolean;
  refetchUser: () => Promise<UserDTO | null>;
  setUser: React.Dispatch<React.SetStateAction<UserDTO | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  // Stan czysto w pamięci RAM – brak powiązania z localStorage
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  const refetchUser = useCallback(async (): Promise<UserDTO | null> => {
    setIsUserLoading(true);
    try {
      const userData = await userService.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Błąd podczas pobierania profilu:', err);
      setUser(null);
      await logout();
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, [logout]);

  // Pobieranie profilu następuje tylko przy uwierzytelnionej sesji
  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated, refetchUser]);

  return (
    <UserContext.Provider value={{ user, isUserLoading, refetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};