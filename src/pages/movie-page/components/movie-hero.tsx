import RuntimeIcon from '@/assets/runtime-icon';
import type { MovieDetail } from '@/api/movies/index.types';

type MovieHeroProps = {
    movie: MovieDetail;
};

const MovieHero = ({ movie }: MovieHeroProps) => {
    return (
        <section className="relative h-150 w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${movie.backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/30" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-row items-end gap-8 pb-15 pl-15">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-93.75 w-72.25 shrink-0 rounded-[14px] object-cover"
                />

                <div className="flex w-145 min-w-0 flex-col gap-3.75">
                    <p className="text-helper-red text-label-s flex w-fit items-center gap-2 rounded-full bg-[#EC30131A] px-3 py-1 font-semibold">
                        <span>NOW PLAYING</span>
                    </p>

                    <h1 className="text-display font-extrabold text-white">
                        {movie.title}
                    </h1>

                    <p className="text-body-m font-regular text-white">
                        {movie.synopsis}
                    </p>

                    <div className="flex flex-row gap-2">
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MovieHero;
