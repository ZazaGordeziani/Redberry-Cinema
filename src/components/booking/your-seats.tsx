import type {
    SelectedSeat,
    TicketType,
} from '@/components/booking/booking.types';

const money = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

type YourSeatsProps = {
    selected: SelectedSeat[];
    priceOf: (seat: SelectedSeat) => number;
    onRemove: (seatId: number) => void;
    onChooseType: (seatId: number, ticketType: TicketType) => void;
    onCheckout: () => void;
};

const YourSeats = ({
    selected,
    priceOf,
    onRemove,
    onChooseType,
    onCheckout,
}: YourSeatsProps) => {
    const subtotal = selected.reduce((sum, seat) => sum + priceOf(seat), 0);

    return (
        <div className="flex w-85 flex-col">
            <h3 className="text-label-m font-extrabold text-white">
                Your Seats · Max 3
            </h3>

            {selected.length === 0 ? (
                <p className="text-body-s font-regular text-light-grey-muted mt-3">
                    Pick up to 3 seats from the map. Each seat can carry its own{' '}
                    <br /> ticket type.
                </p>
            ) : (
                <div className="mt-3 flex flex-col gap-3">
                    {selected.map((seat) => (
                        <div
                            key={seat.seatId}
                            className="bg-background-secondary flex flex-col gap-2 rounded-2xl p-3.75"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-body-s font-regular text-light-grey-muted">
                                        Seat
                                    </span>
                                    <span className="text-label-s font-semibold text-white">
                                        {seat.code}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-label-s font-semibold text-white">
                                        ₾{money(priceOf(seat))}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onRemove(seat.seatId)}
                                        className="text-label-s cursor-pointer font-semibold text-white"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                            <div className="bg-background-tertiary h-px" />
                            <div className="flex gap-2">
                                {(
                                    [
                                        ['child', 'Child · 60%'],
                                        ['student', 'Student · 75%'],
                                        ['adult', 'Adult · 100%'],
                                    ] as const
                                ).map(([type, label]) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            onChooseType(seat.seatId, type)
                                        }
                                        className={`text-body-s font-regular rounded-full px-3.5 py-2 text-white ${
                                            seat.ticketType === type
                                                ? 'bg-helper-red border-background border'
                                                : 'bg-background-tertiary'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-8">
                <div className="flex items-center justify-between">
                    <span className="text-label-s font-semibold text-white">
                        SUBTOTAL
                    </span>
                    <span className="text-label-s font-semibold text-white">
                        ₾{money(subtotal)}
                    </span>
                </div>
                <button
                    type="button"
                    disabled={selected.length === 0}
                    onClick={onCheckout}
                    className={`text-label-m mt-4 w-full rounded-full px-5.5 py-3.25 font-extrabold ${
                        selected.length === 0
                            ? 'text-light-grey-muted bg-dark-grey'
                            : 'bg-helper-red cursor-pointer text-white'
                    }`}
                >
                    Next: Checkout
                </button>
            </div>
        </div>
    );
};

export default YourSeats;
