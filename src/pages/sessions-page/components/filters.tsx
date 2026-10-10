import CheckMark from '@/assets/check-mark';
import { useFilterOptions } from '@/react-query/query';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const sectionLabel =
    'text-label-s font-semibold tracking-overline text-light-grey-muted';
const primaryText = 'text-label-m font-semibold text-white';
const secondaryText = 'text-body-s font-regular text-light-grey-muted';

const weekdayOf = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
    });

const dayOf = (date: string) => new Date(`${date}T00:00:00`).getDate();

const nextSevenDays = () =>
    Array.from({ length: 7 }, (_, index) => {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() + index);

        return [
            day.getFullYear(),
            String(day.getMonth() + 1).padStart(2, '0'),
            String(day.getDate()).padStart(2, '0'),
        ].join('-');
    });

const languageLabel = (name: string) =>
    name === 'Original with Subtitles' ? 'Original + Subtitles' : name;

const splitTimeBand = (label: string) => {
    const match = label.match(/^(.+?)\s*\((.+)\)$/);
    if (!match) return { name: label, detail: '' };
    return { name: match[1], detail: match[2] };
};

const toggleId = <T extends string | number>(list: T[], id: T) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

const asList = (value: unknown) => {
    if (Array.isArray(value)) return value.map(String);
    if (value == null || value === '') return [];
    return [String(value)];
};

const readFilters = (search: string) => {
    const parsed = qs.parse(search, { ignoreQueryPrefix: true });

    return {
        venueIds: asList(parsed.venue)
            .map(Number)
            .filter((id) => !Number.isNaN(id)),
        formatIds: asList(parsed.format)
            .map(Number)
            .filter((id) => !Number.isNaN(id)),
        languageIds: asList(parsed.language)
            .map(Number)
            .filter((id) => !Number.isNaN(id)),
        timeBandIds: asList(parsed.time),
        selectedDate: typeof parsed.date === 'string' ? parsed.date : null,
    };
};

const FilterCheckbox = ({
    checked,
    onChange,
    children,
}: {
    checked: boolean;
    onChange: () => void;
    children: React.ReactNode;
}) => (
    <label className="flex cursor-pointer items-center gap-2.5">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
        />
        <span className="border-light-grey-muted peer-checked:bg-helper-red peer-checked:border-helper-red flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border">
            {checked && <CheckMark className="h-3 w-3 text-white" />}
        </span>
        {children}
    </label>
);

const Divider = () => <hr className="bg-background-tertiary h-px border-0" />;

const Filters = () => {
    const { data: options } = useFilterOptions();
    const location = useLocation();
    const navigate = useNavigate();
    const filters = readFilters(location.search);
    const dates = nextSevenDays();
    const [keepDefaultDate, setKeepDefaultDate] = useState(true);
    const selectedDate =
        filters.selectedDate ?? (keepDefaultDate ? dates[0] : null);
    const dateRowRef = useRef<HTMLDivElement>(null);
    const clearedRef = useRef(false);

    const visibleFormats =
        filters.venueIds.length === 0
            ? (options?.formats ?? [])
            : (options?.formats.filter((format) =>
                  options.venues
                      .filter((venue) => filters.venueIds.includes(venue.id))
                      .some((venue) =>
                          venue.formats.some((item) => item.id === format.id),
                      ),
              ) ?? []);

    const writeFilters = (next: ReturnType<typeof readFilters>) => {
        const search = qs.stringify(
            {
                venue: next.venueIds.length ? next.venueIds : undefined,
                format: next.formatIds.length ? next.formatIds : undefined,
                language: next.languageIds.length
                    ? next.languageIds
                    : undefined,
                time: next.timeBandIds.length ? next.timeBandIds : undefined,
                date: next.selectedDate ?? undefined,
            },
            { arrayFormat: 'repeat', skipNulls: true },
        );

        navigate({ pathname: location.pathname, search });
    };

    useEffect(() => {
        if (clearedRef.current || filters.selectedDate) return;

        writeFilters({
            ...filters,
            selectedDate: dates[0],
        });
    }, []);

    useEffect(() => {
        const row = dateRowRef.current;
        if (!row) return;

        const days = nextSevenDays();
        const date = filters.selectedDate ?? (keepDefaultDate ? days[0] : null);

        if (!date || date === days[0]) {
            row.scrollLeft = 0;
            return;
        }

        if (date === days[days.length - 1]) {
            row.scrollLeft = row.scrollWidth - row.clientWidth;
            return;
        }

        const button = row.querySelector<HTMLButtonElement>(
            `[data-date="${date}"]`,
        );
        if (!button) return;

        const rowRect = row.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        if (buttonRect.right > rowRect.right) {
            row.scrollLeft += buttonRect.right - rowRect.right;
        } else if (buttonRect.left < rowRect.left) {
            row.scrollLeft -= rowRect.left - buttonRect.left;
        }
    }, [filters.selectedDate, keepDefaultDate]);

    const activeCount =
        filters.venueIds.length +
        filters.formatIds.length +
        filters.languageIds.length +
        filters.timeBandIds.length +
        (selectedDate ? 1 : 0);

    const clearFilters = () => {
        clearedRef.current = true;
        setKeepDefaultDate(false);
        writeFilters({
            venueIds: [],
            formatIds: [],
            languageIds: [],
            timeBandIds: [],
            selectedDate: null,
        });
    };

    return (
        <aside className="bg-background-secondary flex w-[320px] flex-col gap-6 rounded-2xl p-6 pb-7.5">
            <h2 className="text-h3 font-extrabold text-white">Filters</h2>

            <section className="flex flex-col gap-3">
                <p className={sectionLabel}>VENUE</p>
                <div className="flex flex-col gap-3">
                    {options?.venues.map((venue) => (
                        <FilterCheckbox
                            key={venue.id}
                            checked={filters.venueIds.includes(venue.id)}
                            onChange={() => {
                                const venueIds = toggleId(
                                    filters.venueIds,
                                    venue.id,
                                );
                                const allowed = new Set(
                                    (options?.venues ?? [])
                                        .filter((item) =>
                                            venueIds.includes(item.id),
                                        )
                                        .flatMap((item) =>
                                            item.formats.map(
                                                (format) => format.id,
                                            ),
                                        ),
                                );

                                writeFilters({
                                    ...filters,
                                    venueIds,
                                    formatIds:
                                        venueIds.length === 0
                                            ? filters.formatIds
                                            : filters.formatIds.filter((id) =>
                                                  allowed.has(id),
                                              ),
                                });
                            }}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <span className={primaryText}>
                                    {venue.name}
                                </span>
                                <span className={secondaryText}> ·</span>
                                <span className={secondaryText}>
                                    {venue.city}
                                </span>
                            </div>
                        </FilterCheckbox>
                    ))}
                </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
                <p className={sectionLabel}>DATE</p>
                <div
                    ref={dateRowRef}
                    className="now-playing-scroll flex gap-1.5 overflow-x-auto"
                >
                    {dates.map((date) => (
                        <button
                            key={date}
                            type="button"
                            data-date={date}
                            onClick={() => {
                                if (selectedDate === date) return;

                                writeFilters({
                                    ...filters,
                                    selectedDate: date,
                                });
                            }}
                            className={`text-label-s bg-background-tertiary flex h-13.5 w-9.25 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-2.5 font-semibold text-white ${
                                selectedDate === date ? 'bg-helper-red' : ''
                            }`}
                        >
                            <span>{weekdayOf(date)}</span>
                            <span>{dayOf(date)}</span>
                        </button>
                    ))}
                </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-4">
                <p className={sectionLabel}>FORMAT</p>
                <div className="flex flex-col gap-3">
                    {visibleFormats.map((format) => (
                        <FilterCheckbox
                            key={format.id}
                            checked={filters.formatIds.includes(format.id)}
                            onChange={() =>
                                writeFilters({
                                    ...filters,
                                    formatIds: toggleId(
                                        filters.formatIds,
                                        format.id,
                                    ),
                                })
                            }
                        >
                            <span className={primaryText}>{format.name}</span>
                        </FilterCheckbox>
                    ))}
                </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-4">
                <p className={sectionLabel}>LANGUAGE</p>
                <div className="flex flex-col gap-3">
                    {options?.languages.map((language) => (
                        <FilterCheckbox
                            key={language.id}
                            checked={filters.languageIds.includes(language.id)}
                            onChange={() =>
                                writeFilters({
                                    ...filters,
                                    languageIds: toggleId(
                                        filters.languageIds,
                                        language.id,
                                    ),
                                })
                            }
                        >
                            <span className={primaryText}>
                                {languageLabel(language.name)}
                            </span>
                        </FilterCheckbox>
                    ))}
                </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-5">
                <p className={sectionLabel}>TIME OF DAY</p>
                <div className="flex flex-col gap-3">
                    {options?.timeBands.map((band) => {
                        const { name, detail } = splitTimeBand(band.label);
                        return (
                            <FilterCheckbox
                                key={band.id}
                                checked={filters.timeBandIds.includes(band.id)}
                                onChange={() =>
                                    writeFilters({
                                        ...filters,
                                        timeBandIds: toggleId(
                                            filters.timeBandIds,
                                            band.id,
                                        ),
                                    })
                                }
                            >
                                <span>
                                    <span className={primaryText}>{name}</span>
                                    <span className={secondaryText}>
                                        {' '}
                                        · {detail}
                                    </span>
                                </span>
                            </FilterCheckbox>
                        );
                    })}
                </div>
            </section>

            <div className="mt-auto flex flex-col gap-6">
                <Divider />
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={activeCount === 0}
                        className={`text-label-s border-light-grey-muted w-full rounded-[999px] border py-2.5 font-semibold text-white ${
                            activeCount === 0 ? 'invisible' : 'cursor-pointer'
                        }`}
                    >
                        Clear filters
                    </button>
                    <p className={`${secondaryText} text-center`}>
                        {activeCount === 1
                            ? '1 filter active'
                            : `${activeCount} filters active`}
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Filters;
