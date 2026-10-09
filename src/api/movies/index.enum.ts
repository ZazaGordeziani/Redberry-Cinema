export const MOVIES_ENDPOINTS = {
    FEATURED: '/movies/featured',
    NOW_PLAYING: '/movies/now-playing',
    COMING_SOON: '/movies/coming-soon',
    NOTIFY: (slug: string) => `/movies/${slug}/notify`,
    DETAIL: (slug: string) => `/movies/${slug}`,
    SESSIONS: (slug: string) => `/movies/${slug}/sessions`,
    SEARCH: '/search',
} as const;
