import type { CatalogueSession, FeaturedMovie } from '@/api/movies/index.types';
import type { SessionsQuery } from '@/api/movies';
import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll';
import { useFilterOptions, useSessions } from '@/react-query/query';
import qs from 'qs';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SessionSort from '@/pages/sessions-page/components/session-sort';

const asList = (value: unknown) => {
    if (Array.isArray(value)) return value.map(String);
    if (value == null || value === '') return [];
    return [String(value)];
};

const todayKey = () => {
    const today = new Date();
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');
};

const languageLabel = (name: string) =>
    name === 'Original with Subtitles' ? 'Original + Subtitles' : name;

const SeatTicket = ({ fill }: { fill: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
            d="M7.93907 0.586073C8.1248 0.40027 8.34531 0.252879 8.58802 0.152318C8.83072 0.0517584 9.09086 0 9.35357 0C9.61628 0 9.87642 0.0517584 10.1191 0.152318C10.3618 0.252879 10.5823 0.40027 10.7681 0.586073L11.4981 1.31707C11.7981 1.61707 11.7661 2.06007 11.5541 2.33707C11.3374 2.62593 11.2323 2.98324 11.2578 3.34341C11.2834 3.70357 11.4381 4.04242 11.6934 4.29773C11.9487 4.55305 12.2876 4.7077 12.6477 4.7333C13.0079 4.7589 13.3652 4.65372 13.6541 4.43707L13.7661 4.36707C13.9109 4.28799 14.0774 4.25754 14.2409 4.28023C14.4043 4.30292 14.5562 4.37753 14.6741 4.49307L15.4141 5.23307C16.1941 6.01407 16.1941 7.28207 15.4141 8.06307L13.5961 9.88007L12.2371 8.52107C12.1428 8.42999 12.0165 8.3796 11.8854 8.38074C11.7543 8.38188 11.6289 8.43446 11.5362 8.52716C11.4435 8.61987 11.3909 8.74527 11.3897 8.87637C11.3886 9.00747 11.439 9.13377 11.5301 9.22807L12.8891 10.5871L8.06107 15.4151C7.87534 15.6009 7.65483 15.7483 7.41213 15.8488C7.16942 15.9494 6.90929 16.0011 6.64657 16.0011C6.38386 16.0011 6.12372 15.9494 5.88102 15.8488C5.63831 15.7483 5.4178 15.6009 5.23207 15.4151L4.49207 14.6751C4.19207 14.3751 4.22407 13.9331 4.43607 13.6551L4.50607 13.5581C4.69619 13.2614 4.7758 12.9073 4.73096 12.5578C4.68611 12.2083 4.51968 11.8858 4.26083 11.6468C4.00198 11.4077 3.66724 11.2674 3.3153 11.2505C2.96336 11.2335 2.61669 11.341 2.33607 11.5541C2.05807 11.7661 1.61507 11.7981 1.31407 11.4981L0.586073 10.7681C0.40027 10.5823 0.252879 10.3618 0.152318 10.1191C0.0517584 9.87642 0 9.61628 0 9.35357C0 9.09086 0.0517584 8.83072 0.152318 8.58802C0.252879 8.34531 0.40027 8.1248 0.586073 7.93907L5.41307 3.11107L6.76307 4.46107C6.85737 4.55215 6.98368 4.60255 7.11477 4.60141C7.24587 4.60027 7.37128 4.54769 7.46398 4.45498C7.55669 4.36228 7.60927 4.23687 7.61041 4.10577C7.61155 3.97468 7.56115 3.84837 7.47007 3.75407L6.12007 2.40407L7.93907 0.586073ZM9.23707 5.52207C9.14277 5.43099 9.01647 5.3806 8.88537 5.38174C8.75427 5.38287 8.62887 5.43546 8.53616 5.52816C8.44346 5.62087 8.39088 5.74627 8.38974 5.87737C8.3886 6.00847 8.43899 6.13477 8.53007 6.22907L9.76307 7.46207C9.85737 7.55315 9.98368 7.60355 10.1148 7.60241C10.2459 7.60127 10.3713 7.54869 10.464 7.45598C10.5567 7.36328 10.6093 7.23787 10.6104 7.10677C10.6115 6.97568 10.5612 6.84937 10.4701 6.75507L9.23707 5.52207Z"
            fill={fill}
        />
    </svg>
);

const SessionCard = ({ session }: { session: CatalogueSession }) => {
    const low = session.isSoldOut || session.seatsLeft < 6;
    const tone = low ? '#EC3013' : '#4ADE80';

    return (
        <article
            className={`bg-background-secondary flex w-63 shrink-0 cursor-pointer flex-col gap-2.5 rounded-2xl p-3.75 ${
                session.isSoldOut ? 'opacity-40' : ''
            }`}
        >
            <div className="flex items-center justify-between gap-4">
                <p className="text-h3 font-extrabold text-white">
                    {session.time}
                </p>
                <span className="bg-background-tertiary text-label-s rounded-full px-2.5 py-1.25 font-semibold text-white">
                    {session.format.name}
                </span>
            </div>

            <div className="flex items-center justify-between gap-4">
                <p className="text-body-s font-regular text-light-grey-muted">
                    {languageLabel(session.language.name)}
                </p>
                <p
                    className="text-body-s font-regular flex items-center gap-1"
                    style={{ color: tone }}
                >
                    <SeatTicket fill={tone} />
                    {session.seatsLeft} left
                </p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <p className="text-label-s font-semibold text-white">
                    {session.venue.name} · Hall{' '}
                    {session.hall.name.toUpperCase()}
                </p>
                <p className="text-label-m font-extrabold text-white">
                    ₾{session.price}
                </p>
            </div>
        </article>
    );
};

const MovieRow = ({
    movie,
    sessions,
}: {
    movie: FeaturedMovie;
    sessions: CatalogueSession[];
}) => {
    const navigate = useNavigate();

    return (
        <article className="flex flex-col overflow-hidden pt-3">
            <button
                type="button"
                onClick={() => navigate(`/movies/${movie.slug}`)}
                className="flex cursor-pointer items-center gap-4 text-left"
            >
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-24 w-18 shrink-0 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <h3 className="text-h3 font-extrabold text-white">
                            {movie.title}
                        </h3>
                        <span className="text-helper-red text-label-s w-fit rounded-full bg-[#EC30131A] px-1.75 py-1 font-semibold">
                            {movie.ageRating.minAge}+
                        </span>
                    </div>
                    <p className="text-body-m font-regular text-light-grey-muted">
                        {movie.runtimeMinutes} min
                    </p>
                </div>
            </button>

            <div className="mt-3.5 min-w-0">
                <HorizontalScroll className="gap-3">
                    {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </HorizontalScroll>
            </div>
        </article>
    );
};

const SessionResults = ({
    onLastPage,
}: {
    onLastPage: (lastPage: number) => void;
}) => {
    const location = useLocation();
    const { data: options } = useFilterOptions();
    const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    const venueIds = asList(parsed.venue).map(Number);
    const formatIds = asList(parsed.format).map(Number);
    const languageIds = asList(parsed.language).map(Number);
    const waitingForOptions =
        (venueIds.length > 0 ||
            formatIds.length > 0 ||
            languageIds.length > 0) &&
        !options;

    const page = Number(parsed.page) || 1;

    const query: SessionsQuery = {
        date: typeof parsed.date === 'string' ? parsed.date : todayKey(),
        sort: typeof parsed.sort === 'string' ? parsed.sort : 'time_asc',
        page,
        venues:
            options?.venues
                .filter((venue) => venueIds.includes(venue.id))
                .map((venue) => venue.slug) ?? [],
        formats:
            options?.formats
                .filter((format) => formatIds.includes(format.id))
                .map((format) => format.slug) ?? [],
        languages:
            options?.languages
                .filter((language) => languageIds.includes(language.id))
                .map((language) => language.slug) ?? [],
        bands: asList(parsed.time),
    };

    const { data, isLoading } = useSessions(query);
    const groups = waitingForOptions ? [] : (data?.data ?? []);
    const total = data?.meta.totalSessions ?? 0;
    const isEmpty = !isLoading && !waitingForOptions && groups.length === 0;
    const lastPage = data?.meta.lastPage ?? 1;

    useEffect(() => {
        onLastPage(lastPage);
    }, [lastPage, onLastPage]);

    return (
        <div className="flex min-w-0 flex-col px-7">
            <div className="flex items-center justify-between">
                <p className="text-label-m font-semibold text-white">
                    {isEmpty
                        ? 'No sessions found'
                        : `Showing ${total} sessions`}
                </p>
                <SessionSort />
            </div>

            {isEmpty ? (
                <div className="mt-6 flex flex-1 items-center justify-center py-20">
                    <p className="text-h3 text-helper-red font-semibold">
                        No Results for this Search
                    </p>
                </div>
            ) : (
                <div className="[&::-webkit-scrollbar-thumb]:bg-helper-red mt-6 max-h-screen scrollbar-thin [scrollbar-color:#EC3013_transparent] overflow-y-auto [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent">
                    {groups.map((group, index) => (
                        <div key={group.movie.id}>
                            <MovieRow
                                movie={group.movie}
                                sessions={group.sessions}
                            />
                            {index < groups.length - 1 && (
                                <div className="py-6">
                                    <hr className="bg-background-tertiary h-px border-0" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SessionResults;
