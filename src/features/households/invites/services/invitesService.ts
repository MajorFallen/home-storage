import { invitesApi } from '../api/invitesApi';
import { 
  type InviteCode, 
  type CreateInviteDTO, 
  type JoinInviteResponse 
} from '../types/invites.types';

export const invitesService = {
  /**
   * Pobiera listę kodów zaproszeń dla danego domostwa
   */
  async getInvites(householdId: string): Promise<InviteCode[]> {
    const response = await invitesApi.getByHouseholdId(householdId);

    if (response.success && Array.isArray(response.invites)) {
      return response.invites;
    }

    throw new Error(response.message || 'Nie udało się pobrać listy zaproszeń.');
  },

  /**
   * Tworzy nowy kod zaproszenia dla domostwa i zwraca jego obiekt
   */
  async createInvite(householdId: string, data: CreateInviteDTO): Promise<InviteCode> {
    const response = await invitesApi.create(householdId, data);

    if (response.success && response.invite) {
      return response.invite;
    }

    throw new Error(response.message || 'Nie udało się utworzyć zaproszenia.');
  },

  /**
   * Usuwa kod zaproszenia na podstawie jego ID oraz ID domostwa
   */
  async deleteInvite(householdId: string, inviteId: string): Promise<boolean> {
    const response = await invitesApi.delete(householdId, inviteId);

    if (response.success) {
      return true;
    }

    throw new Error(response.message || 'Nie udało się usunąć zaproszenia.');
  },

  /**
   * Dołącza użytkownika do domostwa za pomocą kodu zaproszenia
   */
  async joinHousehold(code: string): Promise<JoinInviteResponse['household']> {
    const response = await invitesApi.join({ code });

    if (response.success && response.household) {
      return response.household;
    }

    throw new Error(response.message || 'Nie udało się dołączyć do domostwa.');
  },
};