// src/features/user/types/user.types.ts

export interface BaseApiResponse {
  success: boolean;
  code: string;
  message?: string;
}

// Model użytkownika zwrotny z backendu
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role: string;
}

// Odpowiedź z endpointu GET /me
export interface GetMeResponse extends BaseApiResponse {
  user: UserDTO;
}