export type CreateOrderPayload = {
    holdId: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
};

export type Order = {
    id: number;
    reference: string;
    status: string;
    totalPrice: number;
    paidAt: string;
    refundedAt: string | null;
    isUpcoming: boolean;
    isRefundable: boolean;
    cardLastFour: string;
    contact: {
        fullName: string;
        email: string;
        mobileNumber: string;
    };
    session: {
        id: number;
        startsAt: string;
        date: string;
        time: string;
        hall: { id: number; name: string };
        venue: { id: number; name: string };
        format: { id: number; name: string };
        language: { id: number; name: string };
        movie: {
            title: string;
            runtimeMinutes: number;
            posterUrl: string;
            ageRating: { minAge: number };
        };
    };
    tickets: {
        id: number;
        seatCode: string;
        ticketType: { slug: string; name: string };
        price: number;
    }[];
};
