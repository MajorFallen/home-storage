import { httpClient } from '@/shared/api/httpClient';
import { 
  type GetInvitesResponse, 
  type CreateInviteDTO, 
  type CreateInviteResponse, 
  type DeleteInviteResponse,
  type JoinInviteDTO,
  type JoinInviteResponse
} from '../types/invites.types';

export const invitesApi = {
  // Pobieranie listy zaproszeń dla danego domostwa
  getByHouseholdId: (householdId: string) => {
    return httpClient<GetInvitesResponse>(`/households/${encodeURIComponent(householdId)}/invites`);
  },

  // Tworzenie nowego kodu zaproszenia
  create: (householdId: string, data: CreateInviteDTO) => {
    return httpClient<CreateInviteResponse>(`/households/${encodeURIComponent(householdId)}/invites`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Usuwanie zaproszenia po ID przekazywanym w query params
delete: (householdId: string, inviteId: string) => {
  return httpClient<DeleteInviteResponse>(
    `/households/${encodeURIComponent(householdId)}/invites?inviteId=${encodeURIComponent(inviteId)}`, 
    {
      method: 'DELETE',
    }
  );
},

  // Dołączanie do domostwa za pomocą kodu zaproszenia
  join: (data: JoinInviteDTO) => {
    return httpClient<JoinInviteResponse>('/households/invites/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
