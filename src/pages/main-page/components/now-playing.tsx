import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll';
import { useNowPlayingMovies } from '@/react-query/query';

import { useNavigate } from 'react-router-dom';

const NowPlaying = () => {
    const { data: movies = [], isLoading } = useNowPlayingMovies();
    const navigate = useNavigate();

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
            <HorizontalScroll className="gap-4">
                {movies.map((movie) => {
                    const genreName = movie.genres[0]?.name ?? '';

                    return (
                        <article
                            key={movie.id}

                            className="bg-background-secondary group flex w-65 shrink-0 flex-col rounded-[20px] p-3 shadow-[0_1px_4px_0_#00000033] transition-all duration-[1.1s] hover:w-111.75"
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="h-75 w-full rounded-xl object-cover transition-all duration-[1.5s] group-hover:h-55"
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

                            <p className="text-body-m font-regular text-light-grey-muted line-clamp-3 max-h-0 overflow-hidden pt-0 opacity-0 transition-all duration-[1.5s] group-hover:max-h-20 group-hover:pt-2 group-hover:opacity-100">
                                {movie.synopsis}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <p className="text-label-s flex items-center gap-1 font-semibold text-white">
                                    From ₾ {movie.fromPrice}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/movies/${movie.slug}`)
                                    }
                                    className="bg-helper-red text-label-m cursor-pointer rounded-full px-5.5 py-2.5 font-extrabold text-white"
                                >
                                    Buy Ticket
                                </button>
                            </div>
                        </article>
                    );
                })}
            </HorizontalScroll>
        </section>
    );
};

export default NowPlaying;
