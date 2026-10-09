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
export type FilterLanguage = {
    id: number;
    slug: string;
    name: string;
    code: string;
};
export type FilterChoice = {
    id: string;
    label: string;
};
export type FilterOptions = {
    venues: Venue[];
    formats: VenueFormat[];
    languages: FilterLanguage[];
    timeBands: FilterChoice[];
    sorts: FilterChoice[];
};
