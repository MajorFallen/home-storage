// src/features/households/services/householdsService.ts
import { householdsApi } from '../api/householdsApi';
import { type HouseholdDTO } from '../types/households.types'

export const householdsService = {
  /**
   * Pobiera listę domostw użytkownika
   */
  async getHouseholds(): Promise<HouseholdDTO[]> {
    const response = await householdsApi.getAll();

    if (response.success && Array.isArray(response.households)) {
      return response.households;
    }

    throw new Error(response.message || 'Nie udało się pobrać listy domostw.');
  },

  /**
   * Tworzy nowe domostwo
   */
  async createHousehold(name: string): Promise<boolean> {
    const response = await householdsApi.create({ name });

    if (response.success) {
      return true;
    }

    throw new Error(response.message || 'Nie udało się utworzyć domostwa.');
  },

  /**
   * Usuwa domostwo na podstawie ID
   */
  async deleteHousehold(id: string): Promise<boolean> {
    const response = await householdsApi.delete(id);

    if (response.success) {
      return true;
    }

    throw new Error(response.message || 'Nie udało się usunąć domostwa.');
  },
};