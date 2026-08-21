// src/shared/api/tokenService.ts
import { storageService } from '../services/storageService';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

// Pomocnik do dekodowania pola 'exp' z tokena JWT bez zewnętrznych bibliotek
function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(decodedJson);
    
    // Zwraca true jeśli token wygasł lub wygaśnie w ciągu najbliższych 10 sekund (bufor)
    return Date.now() >= exp * 1000 - 10000;
  } catch {
    return true; // Jeśli dekodowanie się nie uda, uznajemy za wygasły
  }
}

export const tokenService = {
  getAccessToken: () => accessToken,

  setSession: async (token: string, refreshToken?: string) => {
    accessToken = token;
    if (refreshToken) {
      await storageService.setRefreshToken(refreshToken);
    }
  },

  clearSession: async () => {
    accessToken = null;
    await storageService.clearAll();
  },

  /**
   * Zwraca ważny Token. Jeśli obecny wygasł, automatycznie go odświeża.
   * Obsługuje współbieżność (dwa zapytania naraz nie wywołają dwóch refreshy).
   */
  getValidAccessToken: async (): Promise<string | null> => {
    // 1. Jeśli token w pamięci istnieje i jest ważny, zwracamy go natychmiast
    if (accessToken && !isTokenExpired(accessToken)) {
      return accessToken;
    }

    // 2. Jeśli trwa już proces odświeżania, podpinamy się pod istniejący Promise
    if (refreshPromise) {
      return refreshPromise;
    }

    // 3. W przeciwnym razie rozpoczynamy odświeżanie
    refreshPromise = (async () => {
      const refreshToken = await storageService.getRefreshToken();
      if (!refreshToken) {
        await tokenService.clearSession();
        return null;
      }

      try { 
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        await tokenService.setSession(data.token, data.refreshToken);
        return data.token as string;
      } catch {
        await tokenService.clearSession();
        window.dispatchEvent(new Event('auth:unauthorized'));
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
};