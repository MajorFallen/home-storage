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

export interface GetInvitesResponse {
  success: boolean;
  code: 'INVITES_FETCHED';
  invites: InviteCode[];
}

export interface CreateInviteResponse {
  success: boolean;
  code: 'INVITE_CREATED';
  invite: InviteCode;
}

export interface DeleteInviteResponse {
  success: boolean;
  code: 'INVITE_DELETED';
  message: string;
}

export interface JoinInviteResponse {
  success: boolean;
  code: 'HOUSEHOLD_JOINED_SUCCESSFULLY';
  household: {
    id: string;
    name: string;
    created_at: string;
    role: 'member';
  };
}