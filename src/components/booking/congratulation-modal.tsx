import CongratulationsCheckmark from '@/assets/congratulations-checkmark';
import type { Order } from '@/api/order/index.types';

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

const shortDate = (date: string) => {
    const value = new Date(`${date}T00:00:00`);
    if (Number.isNaN(value.getTime())) return '';
    return `${WEEKDAYS[value.getDay()]} ${value.getDate()} ${MONTHS[value.getMonth()]}`;
};

const CongratulationModal = ({
    order,
    onTickets,
    onHome,
}: {
    order: Order;
    onTickets: () => void;
    onHome: () => void;
}) => {
    const tickets = order.tickets;
    const counts = tickets.reduce<Record<string, number>>(
        (accumulator, ticket) => {
            const name = ticket.ticketType.name;
            accumulator[name] = (accumulator[name] ?? 0) + 1;
            return accumulator;
        },
        {},
    );
    const ticketLine = Object.entries(counts)
        .map(([name, count]) => `${count} x ${name}`)
        .join(', ');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs">
            <section className="bg-background flex w-full max-w-350 flex-col items-center gap-4.5 rounded-[28px] py-20">
                {' '}
                <CongratulationsCheckmark />
                <h1 className="text-h1 font-extrabold text-white">
                    Booking confirmed!
                </h1>
                <p className="text-body-m font-regular text-light-grey-muted text-center">
                    Your tickets are ready. We&aposve sent the confirmation to
                    your email.
                </p>
                <p className="text-label-s bg-background-tertiary rounded-full px-6.25 py-2 font-semibold text-white">
                    ORDER #{order.reference}
                </p>
                <div className="bg-background-secondary flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-5">
                    <div className="flex gap-2.5">
                        <img
                            src={order.session.movie.posterUrl}
                            alt=""
                            className="h-16 w-12 rounded-lg object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="text-label-m font-extrabold text-white">
                                {order.session.movie.title}
                            </p>
                            <p className="text-body-s font-regular text-light-grey-muted">
                                {`${order.session.venue.name} · Hall ${order.session.hall.name} · ${shortDate(order.session.date)} · ${order.session.time}`}
                            </p>
                        </div>
                    </div>
                    <div className="bg-background-tertiary h-px" />
                    <div className="flex items-center justify-between">
                        <span className="text-body-s font-regular text-light-grey-muted">
                            Seats
                        </span>
                        <span className="text-body-s font-regular text-white">
                            {tickets
                                .map((ticket) => ticket.seatCode)
                                .join(', ')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-body-s font-regular text-light-grey-muted">
                            Tickets
                        </span>
                        <span className="text-body-s font-regular text-white">
                            {ticketLine}
                        </span>
                    </div>
                    <div className="bg-background-tertiary h-px" />
                    <div className="flex items-center justify-between">
                        <span className="text-body-s font-regular text-light-grey-muted">
                            TOTAL PAID
                        </span>
                        <span className="text-h3 font-extrabold text-white">
                            ₾{order.totalPrice}
                        </span>
                    </div>
                </div>
                <div className="flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onTickets}
                        className="text-label-m bg-helper-red rounded-full px-5.5 py-3.25 font-extrabold text-white"
                    >
                        View my tickets
                    </button>
                    <button
                        type="button"
                        onClick={onHome}
                        className="text-label-m rounded-full bg-[#FFFFFF1A] px-5.5 py-3.25 font-extrabold text-white"
                    >
                        Back to home
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CongratulationModal;
