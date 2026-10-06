export type LoginPayload = { payload: { email: string; password: string } };

export type LoginResponse = {
    user: {
        email: string;
        username: string;
        avatar: string | null;
        id: number;
    };
    token: string;
};

export type RegisterPayload = {
    payload: {
        avatar: File | null;
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
};

export type RegisterResponse = {
    user: {
        id: number;
        username: string;
        email: string;
        avatar?: string | null;
    };
    token: string;
};
export type MeResponse = {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    fullName: string | null;
    mobileNumber: string | null;
    dateOfBirth: string | null;
    age: number;
    preferredVenue: {
        id: number;
        slug: string;
        name: string;
        city: string;
        formats: {
            id: number;
            slug: string;
            name: string;
            priceUplift: number;
        }[];
    } | null;
    profileComplete: boolean;
};
