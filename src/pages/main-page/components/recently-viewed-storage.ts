import type { MovieDetail } from '@/api/movies/index.types';

const STORAGE_KEY = 'recently-viewed-movies';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type RecentMovie = {
    id: number;
    slug: string;
    title: string;
    posterUrl: string;
    runtimeMinutes: number;
    genreName: string;
    ageLabel: number;
    viewedAt: number;
};

export const readRecentMovies = (): RecentMovie[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as RecentMovie[];
        const now = Date.now();
        const fresh = parsed.filter(
            (movie) => now - movie.viewedAt < MAX_AGE_MS,
        );

        if (fresh.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        }

        return fresh;
    } catch {
        return [];
    }
};

export const rememberMovie = (movie: MovieDetail) => {
    const next: RecentMovie = {
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        posterUrl: movie.posterUrl,
        runtimeMinutes: movie.runtimeMinutes,
        genreName: movie.genres[0]?.name ?? '',
        ageLabel: movie.ageRating.minAge,
        viewedAt: Date.now(),
    };

    const rest = readRecentMovies().filter((item) => item.slug !== movie.slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...rest]));
};
