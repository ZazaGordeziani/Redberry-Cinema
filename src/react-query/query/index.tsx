import { getMe } from '@/api/auth';
import {
    getComingSoonMovies,
    getFeaturedMovies,
    getMovie,
    getMovieSessions,
    getNowPlayingMovies,
    searchMovies,
} from '@/api/movies';
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
export const useMovieSessions = (slug: string) =>
    useQuery({
        queryKey: ['movies', slug, 'sessions'],
        queryFn: () => getMovieSessions(slug),
        enabled: !!slug,
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
