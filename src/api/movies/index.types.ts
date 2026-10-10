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
export type MovieDetail = FeaturedMovie & {
    director: string;
    cast: string;
    availableDates: string[];
};
export type MovieVenue = {
    id: number;
    slug: string;
    name: string;
    city: string;
};
export type MovieSession = {
    id: number;
    startsAt: string;
    date: string;
    time: string;
    timeBand: string;
    price: number;
    seatsLeft: number;
    isSoldOut: boolean;
    hall: {
        id: number;
        name: string;
        venue: MovieVenue;
    };
    venue: MovieVenue;
    format: FeaturedMovie['formats'][number];
    language: {
        id: number;
        slug: string;
        name: string;
        code: string;
    };
};
export type VenueSessions = {
    venue: MovieVenue;
    sessions: MovieSession[];
};

export type CatalogueSession = MovieSession & {
    movie: FeaturedMovie;
};
export type SessionGroup = {
    movie: FeaturedMovie;
    sessions: CatalogueSession[];
};
export type SessionsPage = {
    data: SessionGroup[];
    meta: {
        totalSessions: number;
        totalMovies: number;
        lastPage: number;
    };
};
export type SeatState = 'available' | 'sold' | 'held' | 'unavailable';
export type Seat = {
    id: number;
    code: string;
    label: string;
    state: SeatState;
    aisleAfter: boolean;
    isMine: boolean;
};
export type SeatRow = { label: string; seats: Seat[] };
export type SeatSection = { name: string; rows: SeatRow[] };
export type SeatMap = {
    sessionId: number;
    hall: { id: number; name: string; venue: MovieVenue };
    sections: SeatSection[];
};
export type HoldSeat = {
    seatId: number;
    ticketType: 'adult' | 'student' | 'child';
};
export type HoldResult = {
    holdId: string;
    sessionId: number;
    expiresAt: string;
    secondsRemaining: number;
    isLive: boolean;
    subtotal: number;
    seats: {
        seatId: number;
        code: string;
        ticketType: { slug: string; name: string };
        price: number;
    }[];
};
