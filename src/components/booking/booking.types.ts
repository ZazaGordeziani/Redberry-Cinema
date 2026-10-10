export type TicketType = 'adult' | 'student' | 'child';
export type SelectedSeat = {
    seatId: number;
    code: string;
    ticketType: TicketType;
};
