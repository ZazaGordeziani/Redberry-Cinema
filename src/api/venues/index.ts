import { httpClient } from '@/api';
import { VENUES_ENDPOINTS } from '@/api/venues/index.enum';
import type { Venue } from '@/api/venues/index.types';

export const getFilterOptions = async (): Promise<Venue[]> => {
    const response = await httpClient.get(VENUES_ENDPOINTS.FILTER_OPTIONS);

    return response.data.data.venues as Venue[];
};
