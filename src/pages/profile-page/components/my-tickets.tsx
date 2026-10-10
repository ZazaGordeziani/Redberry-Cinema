import type { Order } from '@/api/order/index.types';
import CloseSign from '@/assets/close-sign';
import { useRefundOrder } from '@/react-query/mutation';
import { useTickets } from '@/react-query/query';
import type { AxiosError } from 'axios';
import { useState } from 'react';

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

const NOT_REFUNDABLE =
    'Not refundable anymore, it could be refunded at least 2 hours before the session start';

const languageLabel = (name: string) =>
    name === 'Original with Subtitles' ? 'Original + Subtitles' : name;

const shortDate = (date: string) => {
    const value = new Date(`${date}T00:00:00`);
    if (Number.isNaN(value.getTime())) return '';
    return `${WEEKDAYS[value.getDay()]} ${value.getDate()} ${MONTHS[value.getMonth()]}`;
};

const sessionStart = (date: string, time: string) =>
    new Date(`${date}T${time}:00`);

const refundUntil = (date: string, time: string) => {
    const value = new Date(
        sessionStart(date, time).getTime() - 2 * 60 * 60 * 1000,
    );
    if (Number.isNaN(value.getTime())) return '';
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}, ${WEEKDAYS[value.getDay()]} ${value.getDate()} ${MONTHS[value.getMonth()]}`;
};

const MyTickets = () => {
    const { data: orders = [], isLoading } = useTickets();
    const refund = useRefundOrder();
    const [when, setWhen] = useState<'upcoming' | 'past'>('upcoming');
    const [dialog, setDialog] = useState<string | null>(null);
    const [refundingId, setRefundingId] = useState<string | null>(null);

    const sessionHasStarted = (order: Order) =>
        sessionStart(order.session.date, order.session.time).getTime() <=
        Date.now();
    const wasRefunded = (order: Order) =>
        order.refundedAt != null &&
        new Date(order.refundedAt).getTime() <= Date.now();
    const upcoming = orders.filter(
        (order) => !sessionHasStarted(order) && !wasRefunded(order),
    );
    const past = orders.filter(
        (order) => sessionHasStarted(order) && !wasRefunded(order),
    );
    const visible = when === 'upcoming' ? upcoming : past;

    const onRefund = (reference: string) => {
        setRefundingId(reference);
        refund.mutate(reference, {
            onError: (error) => {
                const response = (error as AxiosError<{ message?: string }>)
                    .response;
                if (response?.status === 422 || response?.status === 403) {
                    setDialog(response.data?.message ?? NOT_REFUNDABLE);
                }
            },
            onSettled: () => setRefundingId(null),
        });
    };

    if (isLoading) {
        return (
            <p className="text-body-m font-regular text-light-grey-muted">
                Loading tickets...
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-background-secondary flex w-fit rounded-xl p-1.25">
                <FilterButton
                    label="Upcoming"
                    count={upcoming.length}
                    active={when === 'upcoming'}
                    onClick={() => setWhen('upcoming')}
                />
                <FilterButton
                    label="Past"
                    count={past.length}
                    active={when === 'past'}
                    onClick={() => setWhen('past')}
                />
            </div>

            <div className="[&::-webkit-scrollbar-thumb]:bg-helper-red flex max-h-[70vh] scrollbar-thin [scrollbar-color:#EC3013_transparent] flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-thumb]:border-l-[5px] [&::-webkit-scrollbar-track]:bg-transparent">
                {visible.map((order) => (
                    <TicketCard
                        key={order.id}
                        order={order}
                        pending={refundingId === order.reference}
                        onRefund={() => onRefund(order.reference)}
                    />
                ))}
            </div>

            {dialog && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs"
                    onClick={() => setDialog(null)}
                >
                    <section
                        className="bg-background border-background-tertiary relative flex w-150 items-center justify-center rounded-[28px] border px-10 py-16"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setDialog(null)}
                            className="absolute top-6 right-6"
                        >
                            <CloseSign className="h-6 w-6 cursor-pointer" />
                        </button>
                        <p className="text-h1 text-helper-red text-center font-semibold">
                            {dialog}
                        </p>
                    </section>
                </div>
            )}
        </div>
    );
};

const FilterButton = ({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`text-label-m flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.75 font-semibold ${
            active
                ? 'bg-background-tertiary text-white'
                : 'text-light-grey-muted'
        }`}
    >
        {label}
        <span className="text-label-s text-dark-grey font-semibold">
            {count}
        </span>
    </button>
);

const TicketCard = ({
    order,
    pending,
    onRefund,
}: {
    order: Order;
    pending: boolean;
    onRefund: () => void;
}) => {
    const { session } = order;
    const showHint = order.isUpcoming && !order.isRefundable;

    return (
        <article className="bg-background-secondary flex items-stretch justify-between rounded-[26px]">
            <div className="flex min-w-0 flex-1 gap-3 p-5">
                <img
                    src={session.movie.posterUrl}
                    alt=""
                    className="h-43 w-30 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <h3 className="text-h2 font-extrabold text-white">
                                {session.movie.title}
                            </h3>
                            <span className="text-helper-red text-label-s shrink-0 rounded-full bg-[#EC30131A] px-2 py-0.75 font-semibold">
                                {session.movie.ageRating.minAge}+
                            </span>
                        </div>
                        <p className="text-body-m font-regular text-light-grey-muted shrink-0">
                            {session.movie.runtimeMinutes} min
                        </p>
                    </div>
                    <div className="mt-3 flex gap-10">
                        <Meta
                            label="DATE"
                            value={`${shortDate(session.date)} · ${session.time}`}
                        />
                        <Meta
                            label="VENUE"
                            value={`${session.venue.name} · Hall ${session.hall.name}`}
                        />
                        <Meta
                            label="FORMAT"
                            value={`${session.format.name} · ${languageLabel(session.language.name)}`}
                        />
                    </div>{' '}
                    <div className="mt-3 flex items-center gap-2">
                        <p className="text-label-s text-light-grey-muted tracking-overline font-semibold">
                            SEATS
                        </p>
                        {order.tickets.map((ticket) => (
                            <span
                                key={ticket.id}
                                className="text-label-s rounded-md bg-[#FFFFFF1A] px-2.5 py-1 font-semibold text-white"
                            >
                                {ticket.seatCode} · {ticket.ticketType.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative flex w-72 shrink-0 flex-col justify-center px-5 py-5">
                <span
                    className="absolute inset-y-0 left-0 w-px"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(to bottom, #505261 0 6px, transparent 6px 12px)',
                    }}
                />
                <p className="text-label-s text-light-grey-muted tracking-overline font-semibold">
                    ORDER
                </p>
                <p className="text-label-m font-semibold text-white">
                    {order.reference}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-label-m text-light-grey-muted font-semibold">
                        Total paid
                    </span>
                    <span className="text-h1 font-extrabold text-white">
                        ₾{order.totalPrice}
                    </span>
                </div>

                <div className="group relative mt-2.5">
                    <button
                        type="button"
                        disabled={!order.isRefundable || pending}
                        onClick={onRefund}
                        className="text-label-m w-full cursor-pointer rounded-full bg-[#FFFFFF1A] px-5.5 py-2.5 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Refund
                    </button>
                    {showHint && (
                        <p className="text-body-s font-regular text-light-grey-muted bg-background pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-64 rounded-xl px-3 py-2 group-hover:block">
                            {NOT_REFUNDABLE}
                        </p>
                    )}
                </div>

                {order.isRefundable && (
                    <p className="text-body-s font-regular text-light-grey-muted mt-3 text-center">
                        Refundable until{' '}
                        {refundUntil(session.date, session.time)}
                    </p>
                )}
            </div>
        </article>
    );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <p className="text-label-s text-light-grey-muted font-semibold">
            {label}
        </p>
        <p className="text-label-m font-semibold text-white">{value}</p>
    </div>
);

export default MyTickets;
