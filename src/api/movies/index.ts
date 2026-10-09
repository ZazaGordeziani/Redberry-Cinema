import { httpClient } from '@/api';
import { MOVIES_ENDPOINTS } from '@/api/movies/index.enum';
import type {
    FeaturedMovie,
    MovieDetail,
    VenueSessions,
} from '@/api/movies/index.types';
import type { SessionsPage } from '@/api/movies/index.types';
import qs from 'qs';

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
    date: string,
): Promise<VenueSessions[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.SESSIONS(slug), {
        params: { date },
    });
    return response.data.data;
};
export const searchMovies = async (query: string): Promise<FeaturedMovie[]> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.SEARCH, {
        params: { q: query },
    });
    return response.data.data;
};

export type SessionsQuery = {
    date: string;
    sort: string;
    page: number;
    venues: string[];
    formats: string[];
    languages: string[];
    bands: string[];
};
export const getSessions = async (
    query: SessionsQuery,
): Promise<SessionsPage> => {
    const response = await httpClient.get(MOVIES_ENDPOINTS.LIST, {
        params: {
            date: query.date,
            sort: query.sort,
            page: query.page,
            venues: query.venues.length ? query.venues : undefined,
            formats: query.formats.length ? query.formats : undefined,
            languages: query.languages.length ? query.languages : undefined,
            bands: query.bands.length ? query.bands : undefined,
        },
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: 'brackets', skipNulls: true }),
    });
    return response.data;
};
