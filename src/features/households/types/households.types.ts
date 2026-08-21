// Zdefiniowane dozwolone role w domostwie
export type HouseholdRole = 'owner' | 'editor' | 'member';

export interface HouseholdDTO {
  id: string;
  name: string;
  created_at: string;
  created_by_id: string | null;
  created_by_name: string | null;
  role: HouseholdRole; // Zamiast string
}

export interface CreateHouseholdDTO {
  name: string;
}

export interface BaseApiResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface GetHouseholdsResponse extends BaseApiResponse {
  households: HouseholdDTO[];
}

export interface CreateHouseholdResponse extends BaseApiResponse {
  household: {
    id: string;
    name: string;
    created_at: string;
    created_by: string;
  };
}

export interface DeleteHouseholdResponse extends BaseApiResponse {}