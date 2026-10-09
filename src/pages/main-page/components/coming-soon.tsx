import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll';
import NotificationIcon from '@/assets/notification-icon';
import type { FeaturedMovie } from '@/api/movies/index.types';
import { useToggleMovieNotify } from '@/react-query/mutation';
import { useComingSoonMovies } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
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

    const onNotifyClick = (movie: FeaturedMovie) => {
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

            <HorizontalScroll className="gap-6">
                {movies.map((movie) => {
                    const genreName = movie.genres[0]?.name ?? '';
                    const notified = movie.isNotified;

                    return (
                        <article
                            key={movie.id}
                            onClick={() => navigate(`/movies/${movie.slug}`)}

                            className="bg-background-secondary flex h-43 w-117.5 shrink-0 flex-row gap-3.75 rounded-[20px] p-3 shadow-[0_1px_4px_0_#00000033]"
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="h-37 w-57.25 shrink-0 rounded-xl object-cover"
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
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onNotifyClick(movie);
                                    }}
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
            </HorizontalScroll>
        </section>
    );
};

export default ComingSoon;
