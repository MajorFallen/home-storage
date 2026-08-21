// src/features/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Silent Refresh przy pierwszym wejściu / F5
    useEffect(() => {
        const bootstrap = async () => {
            const isSuccess = await authService.initAuth();
            setIsAuthenticated(isSuccess);
            setIsLoading(false);
        };

        bootstrap();
    }, []);

    // Nasłuchiwanie zdarzenia awaryjnego wylogowania z apiClienta
    useEffect(() => {
        const handleUnauthorized = () => {
            setIsAuthenticated(false);
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
        setIsAuthenticated(true);
    };

    const register = async (email: string, password: string, name: string) => {
        await authService.register(email, password, name);
    };

    const logout = async () => {
        await authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};