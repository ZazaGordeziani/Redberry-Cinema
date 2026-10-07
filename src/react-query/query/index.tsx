import { getMe } from '@/api/auth';
import { getFeaturedMovies, getNowPlayingMovies } from '@/api/movies';
import { getFilterOptions } from '@/api/venues';
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
