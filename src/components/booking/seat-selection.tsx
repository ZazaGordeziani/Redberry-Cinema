import type { Seat, SeatMap, SeatState } from '@/api/movies/index.types';
import type { SelectedSeat } from '@/components/booking/booking.types';
import { Fragment } from 'react';

const heldStyle =
    "bg-[#1E2031] bg-[length:16px_16px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20viewBox=%270%200%2016%2016%27%3E%3Cg%20opacity=%270.1%27%3E%3Cpath%20d=%27M-10.5718%205.53516L10.4648-10.5716L14.0442-5.89672L-6.99241%2010.2101Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-8.78209%207.87261L12.2545-8.23417L15.8339-3.55927L-5.20273%2012.5475Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M-6.99241%2010.2101L14.0442-5.89672L17.6234-1.22195L-3.41315%2014.8848Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-5.20273%2012.5475L15.8339-3.55927L19.4131%201.11543L-1.62352%2017.2222Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M-3.41315%2014.8848L17.6234-1.22195L21.2027%203.45281L0.166111%2019.5596Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-1.62352%2017.2222L19.4131%201.11543L22.9923%205.7902L1.95574%2021.897Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M0.166111%2019.5596L21.2027%203.45281L24.782%208.12758L3.74537%2024.2344Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M1.95574%2021.897L22.9923%205.7902L26.5716%2010.465L5.535%2026.5717Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3C/g%3E%3C/svg%3E')]";

const heldSeatStyle =
    "bg-[#1E2031] bg-no-repeat bg-[length:52px_52px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2752%27%20height=%2752%27%20viewBox=%270%200%2052%2052%27%3E%3Cg%20opacity=%270.1%27%3E%3Cpath%20d=%27M-32.6345%2018.2178L33.7822-32.6346L45.083-17.875L-21.3337%2032.9774Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-26.9841%2025.5976L39.4326-25.2548L50.7334-10.4952L-15.6834%2040.3572Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M-21.3337%2032.9774L45.083-17.875L56.3835-3.11579L-10.0333%2047.7366Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-15.6834%2040.3572L50.7334-10.4952L62.0337%204.2638L-4.38306%2055.1162Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M-10.0333%2047.7366L56.3835-3.11579L67.6839%2011.6434L1.26717%2062.4958Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M-4.38306%2055.1162L62.0337%204.2638L73.3342%2019.023L6.91739%2069.8754Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3Cpath%20d=%27M1.26717%2062.4958L67.6839%2011.6434L78.9844%2026.4026L12.5676%2077.255Z%27%20fill=%27%23D9D9D9%27/%3E%3Cpath%20d=%27M6.91739%2069.8754L73.3342%2019.023L84.6346%2033.7822L18.2178%2084.6345Z%27%20fill=%27%231E2031%27%20fill-opacity=%270.5%27/%3E%3C/g%3E%3C/svg%3E')]";

const seatClass = (state: SeatState, isSelected: boolean) => {
    const base =
        'flex size-13 shrink-0 items-center justify-center rounded-lg text-label-m font-extrabold';

    if (isSelected) {
        return `${base} cursor-pointer border border-[#070C1C] bg-helper-red text-white`;
    }
    if (state === 'sold') {
        return `${base} cursor-not-allowed border border-transparent bg-[#1E2031] text-[#505261]`;
    }
    if (state === 'held') {
        return `${base} cursor-not-allowed border border-transparent text-light-grey-muted`;
    }
    return `${base} cursor-pointer border border-[#505261] bg-[#1E2031] text-white`;
};

type SeatSelectionProps = {
    step: 'seats' | 'checkout';
    onStepChange: (step: 'seats' | 'checkout') => void;
    map?: SeatMap;
    isLoading: boolean;
    selected: SelectedSeat[];
    forcedSold: string[];
    onToggleSeat: (seat: Seat) => void;
};

const SeatSelection = ({
    step,
    onStepChange,
    map,
    isLoading,
    selected,
    forcedSold,
    onToggleSeat,
}: SeatSelectionProps) => {
    return (
        <div className="flex flex-col">
            <div className="bg-background-tertiary flex w-full gap-2 rounded-full">
                {(['seats', 'checkout'] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onStepChange(item)}
                        className={`text-label-s w-full rounded-full px-4 py-2 font-semibold text-white ${
                            step === item ? 'bg-helper-red' : ''
                        }`}
                    >
                        {item === 'seats' ? 'SEATS' : 'CHECKOUT'}
                    </button>
                ))}
            </div>

            {step === 'checkout' ? (
                <p className="text-body-m font-regular text-light-grey-muted mt-8">
                    Checkout comes next.
                </p>
            ) : (
                <>
                    <div className="bg-background-tertiary text-label-s mt-6.25 rounded-b-[20px] py-2 text-center font-semibold text-white">
                        SCREEN
                    </div>

                    {isLoading || !map ? (
                        <p className="text-body-m font-regular text-light-grey-muted mt-8">
                            Loading seats...
                        </p>
                    ) : (
                        <div className="mt-8 flex flex-col gap-8">
                            {map.sections.map((section) => {
                                const first = section.rows[0]?.label ?? '';
                                const last =
                                    section.rows[section.rows.length - 1]
                                        ?.label ?? '';

                                return (
                                    <div
                                        key={section.name}
                                        className="flex flex-col gap-4"
                                    >
                                        <p className="text-label-s text-light-grey-muted font-semibold">
                                            {section.name.toUpperCase()} · ROWS{' '}
                                            {first}-{last}
                                        </p>
                                        <div className="flex flex-col gap-2.5">
                                            {section.rows.map((row) => {
                                                const firstSeatIndex =
                                                    row.seats.findIndex(
                                                        (seat) =>
                                                            seat.state !==
                                                            'unavailable',
                                                    );
                                                const firstLabel = Number(
                                                    row.seats[firstSeatIndex]
                                                        ?.label ?? 1,
                                                );
                                                const leading =
                                                    Number.isFinite(
                                                        firstLabel,
                                                    ) && firstLabel > 1
                                                        ? firstLabel - 1
                                                        : 0;
                                                const seats =
                                                    firstSeatIndex > 0
                                                        ? row.seats.slice(
                                                              firstSeatIndex,
                                                          )
                                                        : row.seats;

                                                return (
                                                    <div
                                                        key={row.label}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {Array.from(
                                                            { length: leading },
                                                            (_, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="size-13 shrink-0"
                                                                />
                                                            ),
                                                        )}
                                                        <span className="text-label-s w-4 font-semibold text-white">
                                                            {row.label}
                                                        </span>
                                                        {seats.map((seat) => {
                                                            const isSelected =
                                                                selected.some(
                                                                    (item) =>
                                                                        item.seatId ===
                                                                        seat.id,
                                                                );
                                                            const heldByOther =
                                                                seat.state ===
                                                                    'held' &&
                                                                !seat.isMine;
                                                            const state: SeatState =
                                                                forcedSold.includes(
                                                                    seat.code,
                                                                ) ||
                                                                (seat.state ===
                                                                    'sold' &&
                                                                    !seat.isMine)
                                                                    ? 'sold'
                                                                    : heldByOther
                                                                      ? 'held'
                                                                      : 'available';

                                                            return (
                                                                <Fragment
                                                                    key={
                                                                        seat.id
                                                                    }
                                                                >
                                                                    {seat.state ===
                                                                    'unavailable' ? (
                                                                        <span className="size-13 shrink-0" />
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                state ===
                                                                                    'sold' ||
                                                                                state ===
                                                                                    'held'
                                                                            }
                                                                            onClick={() =>
                                                                                onToggleSeat(
                                                                                    seat,
                                                                                )
                                                                            }
                                                                            className={`${seatClass(state, isSelected)} ${
                                                                                state ===
                                                                                'held'
                                                                                    ? heldSeatStyle
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            {
                                                                                seat.label
                                                                            }
                                                                        </button>
                                                                    )}
                                                                    {seat.aisleAfter && (
                                                                        <span className="w-6 shrink-0" />
                                                                    )}
                                                                </Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap justify-center gap-6">
                        <Legend
                            className="border-dark-grey bg-background-secondary border"
                            label="Available"
                        />
                        <Legend
                            className="bg-helper-red border-background border"
                            label="Selected"
                        />
                        <Legend
                            className="bg-background-secondary"
                            label="Sold"
                        />
                        <Legend
                            className={heldStyle}
                            label="Held by another user"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const Legend = ({
    className,
    label,
}: {
    className?: string;
    label: string;
}) => (
    <div className="flex items-center gap-2">
        <span className={`size-4 rounded-sm ${className ?? ''}`} />
        <span className="text-body-s font-regular text-light-grey-muted">
            {label}
        </span>
    </div>
);

export default SeatSelection;
