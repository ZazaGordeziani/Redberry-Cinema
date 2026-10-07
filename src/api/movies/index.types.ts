export type FeaturedMovie = {
    id: number;
    slug: string;
    title: string;
    kind: string;
    runtimeMinutes: number;
    posterUrl: string;
    backdropUrl: string;
    releaseDate: string;
    isComingSoon: boolean;
    isNotified: boolean;
    isFeatured: boolean;
    fromPrice: number;
    ageRating: {
        code: string;
        minAge: number;
        description: string;
    };
    genres: {
        id: number;
        slug: string;
        name: string;
    }[];
    formats: {
        id: number;
        slug: string;
        name: string;
        priceUplift: number;
    }[];
    synopsis: string;
};
