import LeftArrow from '@/assets/left-arrow';
import RightArrow from '@/assets/right-arrow';
import RuntimeIcon from '@/assets/runtime-icon';
import TicketIcon from '@/assets/ticket-icon';
import { useFeaturedMovies } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const { data: movies = [], isLoading } = useFeaturedMovies();
    const [activeIndex, setActiveIndex] = useState(0);
    const movie = movies[activeIndex];
    const user = useAtomValue(userAtom);
    const navigate = useNavigate();

    const formatWeekOf = (dateStr: string) => {
        const d = new Date(dateStr);
        const day = d.getDate();
        const month = d.toLocaleString('en-GB', { month: 'short' });
        return `Week of ${day} ${month}`;
    };

    const onBuyTickets = () => {
        if (user?.token) {
            return;
        }
        navigate('/login');
    };

    useEffect(() => {
        if (movies.length < 2) return;
        const id = window.setTimeout(() => {
            setActiveIndex((i) => (i + 1) % movies.length);
        }, 4000);
        return () => window.clearTimeout(id);
    }, [activeIndex, movies.length]);

    if (isLoading || !movie) return null;

    const weekLabel = formatWeekOf(movie.releaseDate);

    return (
        <section className="relative h-190 w-full overflow-hidden">
            <div
                key={movie.id}
                className="hero-zoom absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${movie.backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/30" />
            <div className="relative z-10 flex h-full w-full flex-col px-15">
                <div className="flex w-145 flex-col gap-3 pt-65">
                    <p className="text-helper-red text-label-s flex w-fit items-center gap-2 rounded-full bg-[#EC30131A] px-3 py-1 font-semibold">
                        <span>Premiere</span>
                        <span className="bg-helper-red inline-block h-0.5 w-0.5" />
                        <span>{weekLabel}</span>
                    </p>

                    <div
                        key={movie.id}
                        className="hero-rise-title flex h-54 flex-col gap-4.5"
                    >
                        <h2 className="text-display font-extrabold text-white">
                            {movie.title}
                        </h2>

                        <div className="hero-rise-rest flex flex-row gap-2">
                            <p className="text-helper-red text-label-s rounded-full bg-[#EC30131A] px-3 py-1 font-semibold">
                                {movie.ageRating.code}
                            </p>
                            <p className="text-label-s flex items-center gap-1 rounded-full bg-[#FFFFFF1A] px-3 py-1 font-semibold text-white">
                                <RuntimeIcon />
                                {movie.runtimeMinutes} Min
                            </p>
                            {movie.formats[0] && (
                                <p className="text-label-s rounded-full bg-[#FFFFFF1A] px-3 py-1 font-semibold text-white">
                                    {movie.formats[0].name}
                                </p>
                            )}
                            {movie.formats[1] && (
                                <p className="text-label-s rounded-full bg-[#FFFFFF1A] px-3 py-1 font-semibold text-white">
                                    {movie.formats[1].name}
                                </p>
                            )}
                        </div>

                        <p className="hero-rise-rest text-body-m font-regular text-white">
                            {movie.synopsis}
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <button
                            type="button"
                            onClick={onBuyTickets}
                            className="bg-helper-red text-label-m flex cursor-pointer items-center gap-1 rounded-full px-5.5 py-3.25 font-extrabold text-white"
                        >
                            <TicketIcon />
                            Buy tickets
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/sessions')}

                            className="text-label-m cursor-pointer rounded-full bg-[#FFFFFF1A] px-5.5 py-3.25 font-extrabold text-white"
                        >
                            All sessions
                        </button>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-5 pt-20">
                    <div className="flex w-full flex-row gap-1.75">
                        {movies.map((_, i) => (
                            <div
                                key={i}
                                className="relative h-0.75 flex-1 overflow-hidden bg-white/30"
                            >
                                {i === activeIndex && (
                                    <div
                                        key={activeIndex}
                                        className="hero-progress-fill bg-helper-red absolute inset-y-0 left-0"
                                    />
                                )}
                                {i < activeIndex && (
                                    <div className="bg-helper-red absolute inset-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((i) =>
                                    i === 0 ? movies.length - 1 : i - 1,
                                )
                            }
                            className="flex h-13.5 w-13.5 cursor-pointer items-center justify-center rounded-full bg-[#070C1C33]"
                        >
                            <LeftArrow />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((i) => (i + 1) % movies.length)
                            }
                            className="flex h-13.5 w-13.5 cursor-pointer items-center justify-center rounded-full bg-[#070C1C33]"
                        >
                            <RightArrow />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
