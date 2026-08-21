// src/shared/services/storageService.ts

export const storageService = {
  async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem('refreshToken');
  },

  async setRefreshToken(token: string): Promise<void> {
    localStorage.setItem('refreshToken', token);
  },

  async removeRefreshToken(): Promise<void> {
    localStorage.removeItem('refreshToken');
  },

  async clearAll(): Promise<void> {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};