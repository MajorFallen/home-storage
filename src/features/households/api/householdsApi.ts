import { httpClient } from '../../../shared/api/httpClient';
import { 
  type GetHouseholdsResponse, 
  type CreateHouseholdDTO, 
  type CreateHouseholdResponse, 
  type DeleteHouseholdResponse 
} from '../types/households.types';

export const householdsApi = {
  getAll: () => {
    return httpClient<GetHouseholdsResponse>('/households');
  },

  create: (data: CreateHouseholdDTO) => {
    return httpClient<CreateHouseholdResponse>('/households', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: (id: string) => {
    return httpClient<DeleteHouseholdResponse>(`/households?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};