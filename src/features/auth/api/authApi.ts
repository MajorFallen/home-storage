// src/features/auth/api/authApi.ts
import { httpClient } from '../../../shared/api/httpClient';
import {
  type LoginDTO,
  type RegisterDTO,
  type LoginResponse,
  type RegisterResponse,
  type LogoutResponse,
} from '../types/auth.types';

export const authApi = {
  login: (data: LoginDTO) => {
    return httpClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data, // Brak potrzeby JSON.stringify(data)
      requiresAuth: false,
    });
  },

  register: (data: RegisterDTO) => {
    return httpClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: data,
      requiresAuth: false,
    });
  },

  logout: () => {
    return httpClient<LogoutResponse>('/auth/logout', {
      method: 'POST',
      requiresAuth: true,
    });
  },
};