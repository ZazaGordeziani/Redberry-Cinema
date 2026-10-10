import type { MovieSession } from '@/api/movies/index.types';
import { useOpenSession } from '@/components/booking/open-session';
import { useMovieSessions } from '@/react-query/query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketIconSeats from '@/assets/ticket-icon-seats';
import { BounceLoader } from 'react-spinners';

type MovieSessionsProps = {
    movieTitle: string;
    minAge: number;
    availableDates: string[];
};

const dayNumberOf = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).getDate();
const stillBookable = (date: string, time: string) =>
    Date.now() <= new Date(`${date}T${time}:00`).getTime() + 10 * 60 * 1000;
const SessionTicket = ({
    session,
    movieTitle,
    minAge,
}: {
    session: MovieSession;
    movieTitle: string;
    minAge: number;
}) => {
    const openSession = useOpenSession();

    return (
        <div
            className={`bg-background flex flex-row items-stretch rounded-lg shadow-[0_1px_2px_0_#00000033] ${
                session.isSoldOut ? 'opacity-40' : 'cursor-pointer'
            }`}
            onClick={() => {
                if (session.isSoldOut) return;

                openSession({
                    sessionId: session.id,
                    movieTitle,
                    minAge,
                    venueName: session.venue.name,
                    hallName: session.hall.name,
                    date: session.date,
                    time: session.time,
                    formatName: session.format.name,
                    languageName: session.language.name,
                    price: session.price,
                });
            }}
        >
            <div className="flex flex-col items-center gap-2 px-4.5 py-2.5">
                <p className="text-h2 font-extrabold text-white">
                    {session.time}
                </p>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-body-s font-regular text-light-grey-muted py-1">
                        {session.language.code}
                    </span>
                    <span className="text-body-s font-regular bg-background-secondary rounded-3xl px-3 py-1 text-white">
                        {session.format.name}
                    </span>
                </div>
            </div>

            <div className="relative flex items-center">
                <span className="bg-background-secondary absolute top-0 left-1/2 size-2.5 -translate-1/2 rounded-full" />
                <svg width="2" height="59" aria-hidden="true">
                    <line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="59"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeDasharray="3 4"
                    />
                </svg>
                <span className="bg-background-secondary absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full" />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 px-4 py-2">
                <p className="text-h3 text-helper-red font-extrabold">
                    ₾ {session.price}
                </p>
                <p
                    className={`text-body-s font-regular flex items-center gap-1 ${
                        session.seatsLeft <= 5
                            ? 'text-helper-red'
                            : 'text-light-grey-muted'
                    }`}
                >
                    <TicketIconSeats
                        fill={session.seatsLeft <= 5 ? '#EC3013' : '#A9A9A9'}
                    />{' '}
                    {session.seatsLeft} left
                </p>
            </div>
        </div>
    );
};

const MovieSessions = ({
    movieTitle,
    minAge,
    availableDates,
}: MovieSessionsProps) => {
    const { slug = '' } = useParams();
    const today = new Date();
    const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');

    const upcomingDates = availableDates
        .filter((date) => date >= todayKey)
        .slice(0, 7);
    const [selectedDate, setSelectedDate] = useState(upcomingDates[0] ?? '');
    const { data: venues = [], isLoading } = useMovieSessions(
        slug,
        selectedDate,
    );

    const weekdayOf = (dateStr: string) =>
        new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
            weekday: 'short',
        });
    const bookableVenues = venues
        .map((group) => ({
            ...group,
            sessions: group.sessions.filter((session) =>
                stillBookable(session.date, session.time),
            ),
        }))
        .filter((group) => group.sessions.length > 0);

    const sessionCount = bookableVenues.reduce(
        (total, group) => total + group.sessions.length,
        0,
    );

    return (
        <div className="flex w-3/4 flex-col">
            <h2 className="text-h2 mb-2 font-extrabold text-white">Sessions</h2>
            <p className="text-label-m font-regular text-light-grey-muted mb-4">
                {sessionCount} sessions over the next seven days
            </p>
            <div className="mb-6 flex flex-row gap-1.75">
                {upcomingDates.map((date) => {
                    const isActive = date === selectedDate;

                    return (
                        <button
                            key={date}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`bg-background-secondary flex h-20 w-20 cursor-pointer flex-col items-center gap-1.75 rounded-2xl px-2 px-2.5 py-1 py-2.25 ${
                                isActive ? 'bg-helper-red' : ''
                            }`}
                        >
                            <span className="text-label-s font-semibold text-white">
                                {weekdayOf(date)}
                            </span>
                            <span className="text-h3 font-extrabold text-white">
                                {dayNumberOf(date)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-8.5 pt-3">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <BounceLoader
                            color="#EC3013"
                            size={84}
                            speedMultiplier={0.6}
                        />
                    </div>
                ) : bookableVenues.length === 0 ? (
                    <p className="text-helper-red text-[32px] font-extrabold">
                        NO AVAILABLE SESSIONS
                    </p>
                ) : (
                    bookableVenues.map((group) => {
                        const halls = group.sessions.reduce<
                            Record<string, MovieSession[]>
                        >((grouped, session) => {
                            const name = session.hall.name;
                            grouped[name] = grouped[name] ?? [];
                            grouped[name].push(session);
                            return grouped;
                        }, {});
                        const hallEntries = Object.entries(halls);

                        return (
                            <div
                                key={group.venue.id}
                                className="flex flex-col gap-4"
                            >
                                <h3 className="text-button font-extrabold text-white">
                                    {group.venue.name}
                                </h3>

                                <div className="grid w-fit grid-cols-[max-content_max-content] gap-x-2.5 gap-y-4">
                                    {hallEntries.map(([hallName, sessions]) => (
                                        <div
                                            key={hallName}
                                            className="bg-background-secondary flex w-[fit] flex-col gap-2 rounded-2xl p-4"
                                        >
                                            <p className="text-label-s font-semibold text-white">
                                                Hall {hallName}
                                            </p>
                                            <div className="flex flex-row gap-2">
                                                {sessions.map((session) => (
                                                    <SessionTicket
                                                        key={session.id}
                                                        session={session}
                                                        movieTitle={movieTitle}
                                                        minAge={minAge}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MovieSessions;
