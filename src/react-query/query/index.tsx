import { getMe } from '@/api/auth';
import {
    getComingSoonMovies,
    getFeaturedMovies,
    getMovie,
    getMovieSessions,
    getNowPlayingMovies,
    getSeatMap,
    getSessions,
    searchMovies,
    type SessionsQuery,
} from '@/api/movies';
import { getTickets } from '@/api/order';
import { getCatalogueFilterOptions, getFilterOptions } from '@/api/venues';
import { userAtom } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

export const useMe = () => {
    const user = useAtomValue(userAtom);
    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        enabled: !!user?.token,
    });
};
export const useVenues = () => {
    return useQuery({
        queryKey: ['filter-options', 'venues'],
        queryFn: getFilterOptions,
    });
};
export const useFeaturedMovies = () =>
    useQuery({
        queryKey: ['movies', 'featured'],
        queryFn: getFeaturedMovies,
    });
export const useNowPlayingMovies = () =>
    useQuery({
        queryKey: ['movies', 'now-playing'],
        queryFn: getNowPlayingMovies,
    });
export const useComingSoonMovies = () =>
    useQuery({
        queryKey: ['movies', 'coming-soon'],
        queryFn: getComingSoonMovies,
    });
export const useMovie = (slug: string) =>
    useQuery({
        queryKey: ['movies', slug],
        queryFn: () => getMovie(slug),
        enabled: !!slug,
    });
export const useMovieSessions = (slug: string, date: string) =>
    useQuery({
        queryKey: ['movies', slug, 'sessions', date],
        queryFn: () => getMovieSessions(slug, date),
        enabled: !!slug && !!date,
    });
export const useSearchMovies = (query: string) =>
    useQuery({
        queryKey: ['movies', 'search', query],
        queryFn: () => searchMovies(query),
        enabled: query.trim().length > 0,
    });
export const useFilterOptions = () =>
    useQuery({
        queryKey: ['filter-options'],
        queryFn: getCatalogueFilterOptions,
    });
export const useSessions = (query: SessionsQuery) =>
    useQuery({
        queryKey: ['sessions', query],
        queryFn: () => getSessions(query),
    });
export const useSeatMap = (sessionId: number | null) =>
    useQuery({
        queryKey: ['sessions', sessionId, 'seats'],
        queryFn: () => getSeatMap(sessionId as number),
        enabled: sessionId != null,
        refetchInterval: 15000,
    });
export const useTickets = () => {
    const user = useAtomValue(userAtom);
    return useQuery({
        queryKey: ['tickets'],
        queryFn: getTickets,
        enabled: !!user?.token,
    });
};
