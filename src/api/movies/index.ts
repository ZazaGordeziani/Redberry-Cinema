import { httpClient } from '@/api';
import { MOVIES_ENDPOINTS } from '@/api/movies/index.enum';
import type { FeaturedMovie } from '@/api/movies/index.types';

export const getFeaturedMovies = async (): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.FEATURED);
    return response.data.data;
};
export const getNowPlayingMovies = async (): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.NOW_PLAYING);
    return response.data.data;
};
