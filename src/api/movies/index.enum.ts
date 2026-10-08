export const MOVIES_ENDPOINTS = {
    FEATURED: '/movies/featured',
    NOW_PLAYING: '/movies/now-playing',
    COMING_SOON: '/movies/coming-soon',
    NOTIFY: (slug: string) => `/movies/${slug}/notify`,
} as const;
