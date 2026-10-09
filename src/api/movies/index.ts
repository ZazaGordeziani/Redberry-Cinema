import { httpClient } from '@/api';
import { MOVIES_ENDPOINTS } from '@/api/movies/index.enum';
import type {
    FeaturedMovie,
    MovieDetail,
    VenueSessions,
} from '@/api/movies/index.types';

export const getFeaturedMovies = async (): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.FEATURED);
    return response.data.data;
};
export const getNowPlayingMovies = async (): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.NOW_PLAYING);
    return response.data.data;
};
export const getComingSoonMovies = async (): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.COMING_SOON);
    return response.data.data;
};
export const toggleMovieNotify = async (slug: string) => {
    const response = await httpClient.post(MOVIES_ENDPOINTS.NOTIFY(slug), {});
    return response.data.data as { movieId: number; subscribed: boolean };
};
export const getMovie = async (slug: string): Promise<MovieDetail> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.DETAIL(slug));
    return response.data.data;
};
export const getMovieSessions = async (
    slug: string,
): Promise<VenueSessions[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.SESSIONS(slug));
    return response.data.data;
};
export const searchMovies = async (query: string): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.SEARCH, {
        params: { q: query },
    });
    return response.data.data;
};
