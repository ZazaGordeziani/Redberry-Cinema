export type ProfileFormValues = {
    fullName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    preferredVenueId: string;
};
export type BackendErrorResponse = {
    message: string;
    errors?: Record<string, string[]>;
};
