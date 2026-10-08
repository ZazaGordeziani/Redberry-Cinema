import type { MovieDetail } from '@/api/movies/index.types';

type MovieDetailsProps = {
    movie: MovieDetail;
};

const formatReleaseDate = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const DetailPair = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-label-s text-light-grey-muted font-semibold">
                {label}
            </p>
            <p className="text-label-m font-semibold text-white">{value}</p>
        </div>
    );
};

const MovieDetails = ({ movie }: MovieDetailsProps) => {
    return (
        <aside className="flex w-1/4 flex-col gap-4 px-6.5">
            <h2 className="text-h2 font-extrabold text-white">Details</h2>

            <DetailPair label="DIRECTOR" value={movie.director} />
            <DetailPair label="MAIN CAST" value={movie.cast} />
            <DetailPair
                label="DURATION"
                value={`${movie.runtimeMinutes} minutes`}
            />
            <DetailPair
                label="RELEASE DATE"
                value={formatReleaseDate(movie.releaseDate)}
            />
            <DetailPair
                label="FORMATS"
                value={movie.formats.map((format) => format.name).join(', ')}
            />

            <div className="flex flex-col gap-1">
                <p className="text-label-s text-light-grey-muted font-semibold">
                    FROM
                </p>
                <p className="text-label-m flex items-center gap-2 font-semibold text-white">
                    ₾{movie.fromPrice}
                </p>
            </div>

            <div className="text-helper-orange flex flex-col gap-1.75 rounded-xl bg-[#E27E041A] p-3">
                <p className="text-label-s font-semibold">RATING NOTE</p>
                <p className="text-body-s font-regular">
                    {movie.ageRating.minAge === 0
                        ? 'Everyone can buy ticket and watch this movie'
                        : `${movie.ageRating.code} Not recommended for under-${movie.ageRating.minAge}s. Tickets require an account aged ${movie.ageRating.minAge} or over`}
                </p>
            </div>
        </aside>
    );
};

export default MovieDetails;
