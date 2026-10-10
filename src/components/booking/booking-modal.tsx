import type { BookingSummary } from '@/components/booking/open-session';
import type {
    SelectedSeat,
    TicketType,
} from '@/components/booking/booking.types';
import SeatSelection from '@/components/booking/seat-selection';
import YourSeats from '@/components/booking/your-seats';
import type { HoldResult, Seat } from '@/api/movies/index.types';
import { holdSeats, releaseHold } from '@/api/movies';
import CompleteProfileModal from '@/pages/movie-page/components/complete-profile-modal';
import { useMe, useSeatMap } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import CloseSign from '@/assets/close-sign';
import { useAtomValue } from 'jotai';
import qs from 'qs';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import CheckoutForm from '@/components/booking/checkout-form';
import CheckoutSummary from '@/components/booking/checkout-summary';
import type { CheckoutDraft } from '@/components/booking/checkout-form';
import CongratulationModal from '@/components/booking/congratulation-modal';
import { createOrder } from '@/api/order';
import type { Order } from '@/api/order/index.types';
type HoldError = { message?: string; contested?: string[] };
type OrderError = {
    message?: string;
    contested?: string[];
    errors?: Record<string, string[]>;
};

const RATIO: Record<TicketType, number> = {
    adult: 1,
    student: 0.75,
    child: 0.6,
};

const languageLabel = (name: string) =>
    name === 'Original with Subtitles' ? 'Original + Subtitles' : name;

const formatDate = (date: string) => {
    const value = new Date(`${date}T00:00:00`);
    const weekday = value.toLocaleDateString('en-GB', { weekday: 'long' });
    const month = value.toLocaleDateString('en-GB', { month: 'long' });
    return `${weekday} ${value.getDate()} ${month}`;
};

const clock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const BookingModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const { data: me, isLoading: isMeLoading } = useMe();
    const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    const sessionId = Number(parsed.booking) || null;
    const summary = (location.state as { booking?: BookingSummary } | null)
        ?.booking;
    const canBook = !!sessionId && !!user?.token && !!me?.profileComplete;
    const {
        data: map,
        isLoading: isMapLoading,
        refetch,
    } = useSeatMap(canBook ? sessionId : null);

    const [selected, setSelected] = useState<SelectedSeat[]>([]);
    const [priced, setPriced] = useState<
        Record<number, { type: TicketType; price: number }>
    >({});
    const [deadline, setDeadline] = useState<number | null>(null);
    const [now, setNow] = useState(() => Date.now());
    const [step, setStep] = useState<'seats' | 'checkout'>(
        parsed.step === 'checkout' ? 'checkout' : 'seats',
    );
    const [notice, setNotice] = useState<string | null>(null);
    const [dialog, setDialog] = useState<string | null>(null);
    const [forcedSold, setForcedSold] = useState<string[]>([]);
    const [canPay, setCanPay] = useState(false);
    const [draft, setDraft] = useState<CheckoutDraft | null>(null);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>(
        {},
    );
    const [isPaying, setIsPaying] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const updateDraft = useCallback((next: CheckoutDraft | null) => {
        setDraft(next);
        setServerErrors({});
    }, []);
    const seeded = useRef<number | null>(null);
    const requestId = useRef(0);
    const holdId = useRef<string | null>(null);

    const close = () => {
        const id = holdId.current;
        holdId.current = null;
        if (id) releaseHold(id);
        const next = qs.parse(location.search, { ignoreQueryPrefix: true });
        delete next.booking;
        delete next.step;

        navigate(
            {
                pathname: location.pathname,
                search: qs.stringify(next, {
                    arrayFormat: 'repeat',
                    skipNulls: true,
                }),
            },
            { replace: true, state: null },
        );
    };
    const chooseStep = (nextStep: 'seats' | 'checkout') => {
        const next = qs.parse(location.search, { ignoreQueryPrefix: true });
        if (nextStep === 'checkout') next.step = 'checkout';
        else delete next.step;
        setStep(nextStep);
        navigate(
            {
                pathname: location.pathname,
                search: qs.stringify(next, {
                    arrayFormat: 'repeat',
                    skipNulls: true,
                }),
            },
            { state: location.state },
        );
    };

    useEffect(() => {
        setSelected([]);
        setPriced({});
        setDeadline(null);
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        setStep(query.step === 'checkout' ? 'checkout' : 'seats');
        setNotice(null);
        setDialog(null);
        setForcedSold([]);
        seeded.current = null;
    }, [sessionId]);

    useEffect(() => {
        if (!map || seeded.current === map.sessionId) return;
        seeded.current = map.sessionId;
        const mine = map.sections.flatMap((section) =>
            section.rows.flatMap((row) =>
                row.seats.filter((seat) => seat.isMine),
            ),
        );
        setSelected(
            mine.map((seat) => ({
                seatId: seat.id,
                code: seat.code,
                ticketType: 'adult',
            })),
        );
    }, [map]);

    useEffect(() => {
        if (!canBook || !sessionId) return;

        if (selected.length === 0) {
            const current = ++requestId.current;
            setDeadline(null);
            setPriced({});
            const id = holdId.current;
            if (!id) return;
            holdId.current = null;
            releaseHold(id).then(() => {
                if (current !== requestId.current) return;
                refetch();
            });
            return;
        }

        const current = ++requestId.current;
        const timer = window.setTimeout(() => {
            holdSeats(
                sessionId,
                selected.map((seat) => ({
                    seatId: seat.seatId,
                    ticketType: seat.ticketType,
                })),
            )
                .then((result: HoldResult) => {
                    if (current !== requestId.current) return;
                    holdId.current = result.holdId;

                    const receivedAt = Date.now();
                    setDeadline(
                        (currentDeadline) =>
                            currentDeadline ??
                            receivedAt + result.secondsRemaining * 1000,
                    );
                    setNow(receivedAt);
                    setPriced(
                        Object.fromEntries(
                            result.seats.map((seat) => [
                                seat.seatId,
                                {
                                    type: seat.ticketType.slug as TicketType,
                                    price: seat.price,
                                },
                            ]),
                        ),
                    );
                })
                .catch((error: AxiosError<HoldError>) => {
                    if (current !== requestId.current) return;
                    const status = error.response?.status;
                    const body = error.response?.data;

                    if (status === 409) {
                        const contested = body?.contested ?? [];
                        setForcedSold(contested);
                        setSelected((currentSeats) =>
                            currentSeats.filter(
                                (seat) => !contested.includes(seat.code),
                            ),
                        );
                        setNotice(
                            body?.message ??
                                `Some of those seats were just taken: ${contested.join(', ')}`,
                        );
                        refetch();
                        return;
                    }

                    if (status === 422 && body?.message) {
                        setDialog(body.message);
                    }
                });
        }, 300);

        return () => window.clearTimeout(timer);
    }, [selected, sessionId, canBook, refetch]);

    useEffect(() => {
        if (!deadline) return;
        setNow(Date.now());
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [deadline]);

    const remaining = deadline
        ? Math.max(0, Math.round((deadline - now) / 1000))
        : 0;

    useEffect(() => {
        if (!deadline || remaining > 0) return;
        setSelected([]);
        setDeadline(null);
        setPriced({});
        chooseStep('seats');
        setDialog('Your hold time expired. Please re-select your seats.');
        refetch();
    }, [remaining, deadline, refetch]);

    const priceOf = (seat: SelectedSeat) => {
        const held = priced[seat.seatId];
        if (held?.type === seat.ticketType) return held.price;
        const base = held
            ? held.price / RATIO[held.type]
            : (summary?.price ?? 0);
        return base * RATIO[seat.ticketType];
    };

    const chooseType = (seatId: number, ticketType: TicketType) => {
        if (ticketType === 'child' && (summary?.minAge ?? 0) >= 16) {
            setDialog('Children are not allowed to watch this movie.');
            return;
        }
        setSelected((current) =>
            current.map((seat) =>
                seat.seatId === seatId ? { ...seat, ticketType } : seat,
            ),
        );
    };

    const toggleSeat = (seat: Seat) => {
        const state = forcedSold.includes(seat.code) ? 'sold' : seat.state;
        if (
            state === 'sold' ||
            state === 'unavailable' ||
            (state === 'held' && !seat.isMine)
        ) {
            return;
        }

        const already = selected.some((item) => item.seatId === seat.id);
        if (already) {
            setSelected((current) =>
                current.filter((item) => item.seatId !== seat.id),
            );
            return;
        }

        if (selected.length >= 3) {
            setDialog("You can't select more than 3 seats.");
            return;
        }

        setSelected((current) => [
            ...current,
            { seatId: seat.id, code: seat.code, ticketType: 'adult' },
        ]);
    };
    const placeOrder = async () => {
        if (!draft || !holdId.current || isPaying) return;
        setIsPaying(true);
        setServerErrors({});

        try {
            const created = await createOrder({
                holdId: holdId.current,
                ...draft,
            });
            holdId.current = null;
            setOrder(created);
        } catch (error) {
            const response = (error as AxiosError<OrderError>).response;
            const status = response?.status;
            const body = response?.data;

            if (status === 422 && body?.errors) {
                setServerErrors(
                    Object.fromEntries(
                        Object.entries(body.errors).map(([key, messages]) => [
                            key,
                            messages[0],
                        ]),
                    ),
                );
                return;
            }

            if (status === 422 && body?.message) {
                if (
                    body.message ===
                    'Your hold time expired. Please select seats again.'
                ) {
                    holdId.current = null;
                    setSelected([]);
                    setDeadline(null);
                    setPriced({});
                    chooseStep('seats');
                    setNotice(body.message);
                    refetch();
                    return;
                }
                setDialog(body.message);
                return;
            }

            if (status === 409) {
                const contested = body?.contested ?? [];
                setForcedSold(contested);
                setSelected((current) =>
                    current.filter((seat) => !contested.includes(seat.code)),
                );
                setNotice(
                    body?.message ?? 'Some of those seats were just taken.',
                );
                chooseStep('seats');
                refetch();
                return;
            }

            if (status === 401) {
                navigate(
                    { pathname: location.pathname, search: location.search },
                    { state: { ...(location.state as object), login: true } },
                );
                return;
            }

            if (status === 403 && body?.message) {
                setDialog(body.message);
            }
        } finally {
            setIsPaying(false);
        }
    };

    if (order) {
        return (
            <CongratulationModal
                order={order}
                onTickets={() => {
                    setOrder(null);
                    navigate('/profile?tab=tickets');
                }}
                onHome={() => {
                    setOrder(null);
                    navigate('/');
                }}
            />
        );
    }

    if (!sessionId || !user?.token || isMeLoading || !me) return null;

    if (!me.profileComplete) {
        return <CompleteProfileModal onClose={close} />;
    }

    const meta = summary
        ? [
              summary.venueName,
              `Hall ${summary.hallName}`,
              formatDate(summary.date),
              summary.time,
              summary.formatName,
              languageLabel(summary.languageName),
          ].join(' · ')
        : '';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs"
            onClick={close}
        >
            <section
                className={`bg-background flex max-h-[90vh] max-w-[95vw] flex-col gap-8 overflow-auto rounded-[28px] p-8`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex h-14.5 shrink-0 items-start justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-h2 font-extrabold text-white">
                            {summary?.movieTitle ?? 'Session'}
                        </h2>
                        {meta && (
                            <p className="text-body-s font-regular text-light-grey-muted">
                                {meta}
                            </p>
                        )}
                        {notice && (
                            <p className="text-body-s font-regular text-helper-red">
                                {notice}
                            </p>
                        )}
                    </div>

                    <div className="flex items-start gap-4">
                        {selected.length > 0 && deadline && (
                            <div className="bg-background-secondary rounded-2xl px-3.5 py-2">
                                <p className="text-label-s text-light-grey-muted font-semibold">
                                    Seats Held
                                </p>
                                <p className="text-label-m mt-0.5 font-extrabold text-white">
                                    {clock(remaining)}
                                </p>
                            </div>
                        )}
                        <button type="button" onClick={close}>
                            <CloseSign className="h-6 w-6 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {step === 'seats' ? (
                        <SeatSelection
                            step={step}
                            onStepChange={chooseStep}
                            map={map}
                            isLoading={isMapLoading}
                            selected={selected}
                            forcedSold={forcedSold}
                            onToggleSeat={toggleSeat}
                        />
                    ) : (
                        <CheckoutForm
                            step={step}
                            onStepChange={chooseStep}
                            fullName={me.fullName ?? ''}
                            email={me.email ?? ''}
                            mobileNumber={me.mobileNumber ?? ''}
                            onValidChange={setCanPay}
                            serverErrors={serverErrors}
                            onDraftChange={updateDraft}
                        />
                    )}
                    <div className="bg-background-secondary w-px self-stretch" />
                    {step === 'seats' ? (
                        <YourSeats
                            selected={selected}
                            priceOf={priceOf}
                            onRemove={(seatId) =>
                                setSelected((current) =>
                                    current.filter(
                                        (item) => item.seatId !== seatId,
                                    ),
                                )
                            }
                            onChooseType={chooseType}
                            onCheckout={() => chooseStep('checkout')}
                        />
                    ) : (
                        <CheckoutSummary
                            movieTitle={summary?.movieTitle ?? 'Session'}
                            hallName={summary?.hallName ?? ''}
                            date={summary?.date ?? ''}
                            time={summary?.time ?? ''}
                            selected={selected}
                            subtotal={selected.reduce(
                                (sum, seat) => sum + priceOf(seat),
                                0,
                            )}
                            canPay={canPay}
                            isPaying={isPaying}
                            onPay={placeOrder}
                        />
                    )}
                </div>
            </section>

            {dialog && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs"
                    onClick={(event) => {
                        event.stopPropagation();
                        setDialog(null);
                    }}
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

export default BookingModal;
