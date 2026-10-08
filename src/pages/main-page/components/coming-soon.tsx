import NotificationIcon from '@/assets/notification-icon';
import type { FeaturedMovie } from '@/api/movies/index.types';
import { useToggleMovieNotify } from '@/react-query/mutation';
import { useComingSoonMovies } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const formatInCinemas = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-GB', { month: 'long' }).toUpperCase();
    return `IN CINEMAS ${day} ${month}`;
};

const ComingSoon = () => {
    const { data: movies = [], isLoading } = useComingSoonMovies();
    const user = useAtomValue(userAtom);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumb, setThumb] = useState({ width: 0, left: 0 });

    const { mutate: toggleNotify, isPending } = useToggleMovieNotify({
        onSuccess: (data, slug) => {
            queryClient.setQueryData<FeaturedMovie[]>(
                ['movies', 'coming-soon'],
                (old) =>
                    old?.map((m) =>
                        m.slug === slug
                            ? { ...m, isNotified: data.subscribed }
                            : m,
                    ),
            );
        },
    });

    const updateThumb = () => {
        const el = scrollRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const trackWidth = track.clientWidth;

        if (scrollWidth <= clientWidth) {
            setThumb({ width: trackWidth, left: 0 });
            return;
        }

        const width = Math.max((clientWidth / scrollWidth) * trackWidth, 24);
        const maxLeft = trackWidth - width;
        const left = (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;

        setThumb({ width, left });
    };

    useEffect(() => {
        updateThumb();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('scroll', updateThumb);
        window.addEventListener('resize', updateThumb);

        const ro = new ResizeObserver(updateThumb);
        ro.observe(el);

        return () => {
            el.removeEventListener('scroll', updateThumb);
            window.removeEventListener('resize', updateThumb);
            ro.disconnect();
        };
    }, [movies]);

    const onThumbMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        const el = scrollRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const startX = e.clientX;
        const startLeft = thumb.left;
        const trackWidth = track.clientWidth;
        const maxLeft = trackWidth - thumb.width;
        const maxScroll = el.scrollWidth - el.clientWidth;

        const onMove = (ev: globalThis.MouseEvent) => {
            const delta = ev.clientX - startX;
            const nextLeft = Math.min(Math.max(startLeft + delta, 0), maxLeft);
            el.scrollLeft = (nextLeft / maxLeft) * maxScroll;
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const onNotifyClick = (movie: FeaturedMovie) => {
        if (movie.isNotified) return;
        if (!user?.token) {
            navigate('/login');
            return;
        }
        toggleNotify(movie.slug);
    };

    if (isLoading) return null;

    return (
        <section className="mt-10 flex w-full flex-col gap-6 px-15">
            <div className="flex items-center justify-between">
                <h2 className="text-h1 font-extrabold text-white">
                    COMING SOON
                </h2>
                <button
                    type="button"
                    className="text-label-m text-helper-red cursor-pointer font-semibold"
                >
                    See all
                </button>
            </div>

            <div className="relative">
                <div
                    ref={scrollRef}
                    className="now-playing-scroll flex gap-6 overflow-x-auto pb-3.75"
                    onWheel={(e) => {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                            e.currentTarget.scrollLeft += e.deltaY;
                        }
                    }}
                >
                    {movies.map((movie) => {
                        const genreName = movie.genres[0]?.name ?? '';
                        const notified = movie.isNotified;

                        return (
                            <article
                                key={movie.id}
                                className="bg-background-secondary flex h-43 w-117.5 shrink-0 flex-row gap-3.75 rounded-[20px] p-3 shadow-[0_1px_4px_0_#00000033]"
                            >
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="h-37 w-57.25 shrink-0 rounded-xl object-cover"
                                    onLoad={updateThumb}
                                />

                                <div className="flex min-w-0 flex-col gap-1.75">
                                    <p className="text-helper-red text-label-s font-semibold">
                                        {formatInCinemas(movie.releaseDate)}
                                    </p>

                                    <h3 className="text-label-s font-semibold text-white">
                                        {movie.title}
                                    </h3>

                                    <p className="text-body-s font-regular text-light-grey-muted">
                                        {genreName}
                                        {genreName && ' · '}
                                        {movie.runtimeMinutes} Min
                                    </p>

                                    <p className="text-helper-red text-label-s w-fit rounded-full bg-[#EC30131A] px-1.75 py-1 font-semibold">
                                        {movie.ageRating.minAge}+
                                    </p>

                                    <button
                                        type="button"
                                        disabled={isPending || notified}
                                        onClick={() => onNotifyClick(movie)}
                                        className={`text-label-s border-light-grey-muted mt-3 flex w-fit items-center gap-1 rounded-full border px-3 py-1.5 font-semibold ${
                                            notified
                                                ? 'text-light-grey-muted cursor-default'
                                                : 'cursor-pointer text-white'
                                        }`}
                                    >
                                        {!notified && <NotificationIcon />}
                                        {notified
                                            ? 'You will be notified'
                                            : 'Notify me'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div
                    ref={trackRef}
                    className="bg-light-grey-muted relative mt-4 h-1.5 w-full rounded-[22px]"
                >
                    <div
                        className="bg-helper-red absolute top-0 h-full cursor-pointer rounded-[22px]"
                        style={{
                            width: `${thumb.width}px`,
                            left: `${thumb.left}px`,
                        }}
                        onMouseDown={onThumbMouseDown}
                    />
                </div>

                <div className="from-background pointer-events-none absolute top-0 right-0 bottom-3.75 z-10 w-20 bg-linear-to-l to-transparent" />
            </div>
        </section>
    );
};

export default ComingSoon;
