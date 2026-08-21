// src/features/auth/types/auth.types.ts

export interface BaseApiResponse {
  success: boolean;
  code: string;
  message?: string;
}

// --- Request DTOs ---

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

// --- Response Types ---

export interface LoginResponse extends BaseApiResponse {
  token: string;
  refreshToken?: string;
}

export interface RegisterResponse extends BaseApiResponse {}

export interface LogoutResponse extends BaseApiResponse {}