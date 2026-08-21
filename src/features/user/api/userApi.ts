// src/features/user/api/userApi.ts
import { httpClient } from '../../../shared/api/httpClient';
import { type GetMeResponse } from '../types/user.types';

export const userApi = {
  /**
   * GET /me
   * Pobiera profil aktualnie zalogowanego użytkownika
   */
  getMe: () => {
    return httpClient<GetMeResponse>('/me');
  },
};