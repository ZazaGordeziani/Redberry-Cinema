import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll';
import {
    readRecentMovies,
    type RecentMovie,
} from '@/pages/main-page/components/recently-viewed-storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentlyViewed = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<RecentMovie[]>([]);

    useEffect(() => {
        setMovies(readRecentMovies());
    }, []);

    if (movies.length === 0) return null;

    return (
        <>
            <section className="mt-8 flex w-full flex-col gap-2.25 px-15">
                <h2 className="text-h1 font-extrabold text-white">
                    Recently viewed
                </h2>

                <HorizontalScroll className="gap-5">
                    {movies.map((movie) => (
                        <article
                            key={movie.id}
                            onClick={() => navigate(`/movies/${movie.slug}`)}
                            className="bg-background-secondary flex h-21.75 w-82.5 shrink-0 cursor-pointer flex-row gap-3 rounded-2xl p-2.5"
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="h-16.75 w-21.75 shrink-0 rounded-lg object-cover"
                            />

                            <div className="flex min-w-0 flex-col gap-1">
                                <h3 className="text-label-m truncate font-extrabold text-white">
                                    {movie.title}
                                </h3>
                                <p className="text-body-s font-regular text-light-grey-muted">
                                    {movie.genreName}
                                    {movie.genreName && ' · '}
                                    {movie.runtimeMinutes} Min
                                </p>
                                <p className="text-helper-red text-label-s w-fit rounded-[999px] bg-[#EC30131A] px-2 py-1 font-semibold">
                                    {movie.ageLabel}+
                                </p>
                            </div>
                        </article>
                    ))}
                </HorizontalScroll>
            </section>

            <div className="bg-background-tertiary mt-10 h-px w-full" />
        </>
    );
};

export default RecentlyViewed;
