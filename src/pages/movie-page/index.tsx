import MovieDetails from '@/pages/movie-page/components/movie-details';
import MovieHero from '@/pages/movie-page/components/movie-hero';
import MovieSessions from '@/pages/movie-page/components/movie-sessions';
import { useMe, useMovie, useMovieSessions } from '@/react-query/query';
import { useParams } from 'react-router-dom';

const MoviePage = () => {
    const { slug = '' } = useParams();
    const { data: movie, isLoading: isMovieLoading } = useMovie(slug);
    const { data: venues = [] } = useMovieSessions(slug);
    const { data: me, isLoading: isMeLoading } = useMe();

    if (isMovieLoading || isMeLoading || !movie) return null;

    const profileComplete = me?.profileComplete ?? false;
    const isUnderAge =
        profileComplete && !!me && me.age < movie.ageRating.minAge;

    return (
        <div className="flex w-full flex-col gap-10">
            <MovieHero movie={movie} />

            <div className="flex flex-row px-15">
                {isUnderAge ? (
                    <div className="flex min-h-80 w-3/4 items-center justify-center px-6">
                        <p className="text-display text-helper-red text-center font-extrabold">
                            Age Restriction - You Are Not Allowed to Buy Ticket
                            for this Movie, Must be at Least{' '}
                            {movie.ageRating.minAge} Years Old!!!
                        </p>
                    </div>
                ) : (
                    <MovieSessions
                        venues={venues}
                        availableDates={movie.availableDates}
                        profileComplete={profileComplete}
                    />
                )}
                <MovieDetails movie={movie} />
            </div>
        </div>
    );
};

export default MoviePage;
