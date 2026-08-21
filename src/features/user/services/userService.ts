// src/features/user/services/userService.ts
import { userApi } from '../api/userApi';
import { type UserDTO } from '../types/user.types';

export const userService = {
  /**
   * Pobiera profil aktualnie zalogowanego użytkownika z API
   */
  async getMe(): Promise<UserDTO> {
    const response = await userApi.getMe();

    if (response.success && response.user) {
      return response.user;
    }

    throw new Error(response.message || 'Nie udało się pobrać profilu użytkownika.');
  },
};