import type {
    SelectedSeat,
    TicketType,
} from '@/components/booking/booking.types';

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TYPE_LABEL: Record<TicketType, string> = {
    adult: 'Adult',
    student: 'Student',
    child: 'Child',
};

const shortDate = (date: string) => {
    const value = new Date(`${date}T00:00:00`);
    if (Number.isNaN(value.getTime())) return '';
    return `${WEEKDAYS[value.getDay()]} ${value.getDate()} ${MONTHS[value.getMonth()]}`;
};

const money = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

type CheckoutSummaryProps = {
    movieTitle: string;
    hallName: string;
    date: string;
    time: string;
    selected: SelectedSeat[];
    subtotal: number;
    canPay: boolean;
};

const CheckoutSummary = ({
    movieTitle,
    hallName,
    date,
    time,
    selected,
    subtotal,
    canPay,
}: CheckoutSummaryProps) => {
    const counts = selected.reduce<Partial<Record<TicketType, number>>>(
        (accumulator, seat) => {
            accumulator[seat.ticketType] =
                (accumulator[seat.ticketType] ?? 0) + 1;
            return accumulator;
        },
        {},
    );
    const tickets = (['adult', 'student', 'child'] as const)
        .filter((type) => counts[type])
        .map((type) => `${counts[type]} x ${TYPE_LABEL[type]}`)
        .join(', ');

    return (
        <div className="flex w-85 flex-col">
            <h3 className="text-label-m font-extrabold text-white">Summary</h3>
            {selected.length > 0 && (
                <div className="bg-background-secondary mt-3 flex flex-col gap-2.5 rounded-2xl p-4">
                    <p className="text-label-m font-extrabold text-white">
                        {movieTitle}
                    </p>
                    <p className="text-body-s font-regular text-light-grey-muted">
                        {`Hall ${hallName} · ${shortDate(date)} · ${time}`}
                    </p>
                    <div className="bg-background-tertiary h-px" />
                    <div className="flex items-center justify-between">
                        <span className="text-body-s font-regular text-light-grey-muted">
                            Seats
                        </span>
                        <span className="text-body-s font-semibold text-white">
                            {selected.map((seat) => seat.code).join(', ')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-body-s font-regular text-light-grey-muted">
                            Tickets
                        </span>
                        <span className="text-body-s font-semibold text-white">
                            {tickets}
                        </span>
                    </div>
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
                    disabled={!canPay}
                    className={`text-label-m mt-4 w-full rounded-full px-5.5 py-3.25 font-extrabold ${
                        canPay
                            ? 'bg-helper-red cursor-pointer text-white'
                            : 'text-light-grey-muted bg-dark-grey'
                    }`}
                >
                    Pay: Complete order
                </button>
            </div>
        </div>
    );
};

export default CheckoutSummary;
