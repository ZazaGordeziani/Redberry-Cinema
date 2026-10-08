import { useNowPlayingMovies } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const NowPlaying = () => {
    const { data: movies = [], isLoading } = useNowPlayingMovies();
    const user = useAtomValue(userAtom);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumb, setThumb] = useState({ width: 0, left: 0 });

    const onBuyTicket = () => {
        if (user?.token) return;
        navigate('/login');
    };

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

    if (isLoading) return null;

    return (
        <section className="mt-8 mb-10 flex w-full flex-col gap-6 px-15">
            <div className="flex items-center justify-between">
                <h2 className="text-h1 font-extrabold text-white">
                    NOW PLAYING
                </h2>
                <button
                    type="button"
                    onClick={() => navigate('/sessions')}
                    className="text-label-m text-helper-red cursor-pointer font-semibold"
                >
                    See all
                </button>
            </div>

            <div className="relative">
                <div
                    ref={scrollRef}
                    className="now-playing-scroll flex gap-4 overflow-x-auto pb-3.75"
                    onWheel={(e) => {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                            e.currentTarget.scrollLeft += e.deltaY;
                        }
                    }}
                >
                    {movies.map((movie) => {
                        const genreName = movie.genres[0]?.name ?? '';

                        return (
                            <article
                                onClick={() =>
                                    navigate(`/movies/${movie.slug}`)
                                }
                                key={movie.id}
                                onMouseEnter={updateThumb}
                                onMouseLeave={updateThumb}
                                className="bg-background-secondary group flex w-65 shrink-0 cursor-pointer flex-col rounded-[20px] p-3 shadow-[0_1px_4px_0_#00000033] transition-all duration-300 hover:w-111.75"
                            >
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="h-75 w-full rounded-xl object-cover transition-all duration-300 group-hover:h-55"
                                    onLoad={updateThumb}
                                />

                                <h3 className="text-h3 mt-2.25 font-extrabold text-white">
                                    {movie.title}
                                </h3>

                                <p className="text-body-m font-regular text-light-grey-muted mt-1.75">
                                    {genreName}
                                    {genreName && ' · '}
                                    {movie.runtimeMinutes} Min
                                </p>

                                <p className="text-helper-red text-label-s mt-1.75 w-fit rounded-full bg-[#EC30131A] px-1.75 py-1 font-semibold">
                                    {movie.ageRating.minAge}+
                                </p>

                                <p className="text-body-m font-regular text-light-grey-muted mt-1.75 line-clamp-3 hidden pt-2 group-hover:block">
                                    {movie.synopsis}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <p className="text-label-s flex items-center gap-1 font-semibold text-white">
                                        From ₾ {movie.fromPrice}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onBuyTicket();
                                        }}
                                        className="bg-helper-red text-label-m cursor-pointer rounded-full px-5.5 py-2.5 font-extrabold text-white"
                                    >
                                        Buy Ticket
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

export default NowPlaying;
