export interface InviteCode {
  id: string;
  code: string;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  created_at: string;
  created_by_id: string;
  created_by_name: string | null;
  created_by_email: string | null;
}

export interface CreateInviteDTO {
  maxUses: number | null;
  expiresInDays: number | null;
}

export interface JoinInviteDTO {
  code: string;
}

export interface BaseApiResponse {
  success: boolean;
  code: string;
  message?: string; // Opcjonalny komunikat dla frontendu (np. do Toastów)
}

export interface GetInvitesResponse extends BaseApiResponse {
  code: 'INVITES_FETCHED';
  invites: InviteCode[];
}

export interface CreateInviteResponse extends BaseApiResponse {
  code: 'INVITE_CREATED';
  invite: InviteCode;
}

export interface DeleteInviteResponse extends BaseApiResponse {
  code: 'INVITE_DELETED';
  // message dziedziczy jako string (lub wymuszony string)
}

export interface JoinInviteResponse extends BaseApiResponse {
  code: 'HOUSEHOLD_JOINED_SUCCESSFULLY';
  household: {
    id: string;
    name: string;
    created_at: string;
    role: 'member';
  };
}