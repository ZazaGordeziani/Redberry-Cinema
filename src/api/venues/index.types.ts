export type VenueFormat = {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
};
export type Venue = {
    id: number;
    slug: string;
    name: string;
    city: string;
    formats: VenueFormat[];
};
export type FilterOptionsResponse = {
    venues: Venue[];
};
