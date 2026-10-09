import DropDownArrow from '@/assets/drop-down-arrow';
import qs from 'qs';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SORT_OPTIONS = [
    { id: 'time_asc', label: 'Showtime: Earliest First' },
    { id: 'time_desc', label: 'Showtime: Latest First' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'title_asc', label: 'Title: A–Z' },
];

const SessionSort = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    const sortId = typeof parsed.sort === 'string' ? parsed.sort : 'time_asc';
    const current =
        SORT_OPTIONS.find((option) => option.id === sortId) ?? SORT_OPTIONS[0];

    const choose = (id: string) => {
        const next = qs.parse(location.search, { ignoreQueryPrefix: true });
        next.sort = id;
        delete next.page;

        navigate({
            pathname: location.pathname,
            search: qs.stringify(next, {
                arrayFormat: 'repeat',
                skipNulls: true,
            }),
        });
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex cursor-pointer items-center gap-2"
            >
                <span className="text-body-m font-regular text-light-grey-muted">
                    Sort:
                </span>
                <span className="text-label-m font-extrabold text-white">
                    {current.label}
                </span>
                <span className={open ? 'rotate-180' : ''}>
                    <DropDownArrow />
                </span>
            </button>

            {open && (
                <div className="bg-background border-background-tertiary absolute top-full left-0 z-20 mt-2 flex w-full flex-col gap-3.75 rounded-xl border px-4 py-4">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => choose(option.id)}
                            className="text-label-m cursor-pointer text-left font-extrabold text-white"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SessionSort;
