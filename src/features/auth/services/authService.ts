// src/features/auth/services/authService.ts
import { authApi } from '../api/authApi';
import { tokenService } from '../../../shared/api/tokenService';

export const authService = {
  async login(email: string, password: string): Promise<void> {
    // 1. Zapytanie do backendu zwraca { token, refreshToken, user }
    const response = await authApi.login({ email, password });

    // 2. Przekazujemy odebrane tokeny do tokenService
    if (response.token) {
      await tokenService.setSession(response.token, response.refreshToken);
    }
  },

  async register(email: string, password: string, name: string): Promise<void> {
    await authApi.register({ email, password, name });
    // Opcjonalnie: jeśli po rejestracji backend automatycznie loguje i zwraca tokeny,
    // tutaj również możesz wywołać tokenService.setSession(...)
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      // Ignorujemy błędy sieciowe – stan aplikacji i tak musimy wyczyścić
    } finally {
      // 3. Czyszczenie sesji w RAM oraz w pamięci trwałej
      await tokenService.clearSession();
    }
  },

  /**
   * Wywoływane przy starcie aplikacji (np. w AuthContext)
   */
  async initAuth(): Promise<boolean> {
    // tokenService sam sprawdzi storageService, spróbuje odświeżyć token
    // i wstawi go do pamięci RAM, jeśli jest ważny
    const validToken = await tokenService.getValidAccessToken();
    return !!validToken;
  },
};