import { httpClient } from '@/api';
import { VENUES_ENDPOINTS } from '@/api/venues/index.enum';
import type { FilterOptions, Venue } from '@/api/venues/index.types';
export const getCatalogueFilterOptions = async (): Promise<FilterOptions> => {
    const response = await httpClient.get(VENUES_ENDPOINTS.FILTER_OPTIONS);
    return response.data.data as FilterOptions;
};

export const getFilterOptions = async (): Promise<Venue[]> => {
    const options = await getCatalogueFilterOptions();
    return options.venues;
};
