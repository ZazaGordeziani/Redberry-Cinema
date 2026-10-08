import TicketIconGrey from '@/assets/ticket-icon-grey';
import type { MovieSession, VenueSessions } from '@/api/movies/index.types';
import CompleteProfileModal from '@/pages/movie-page/components/complete-profile-modal';
import { useState } from 'react';

type MovieSessionsProps = {
    venues: VenueSessions[];
    availableDates: string[];
    profileComplete: boolean;
};

const weekdayOf = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
    });

const dayNumberOf = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).getDate();

const SessionTicket = ({ session }: { session: MovieSession }) => {
    return (
        <div className="bg-background flex flex-row items-stretch rounded-lg shadow-[0_1px_2px_0_#00000033]">
            <div className="flex cursor-pointer flex-col items-center gap-2 px-4.5 py-2.5">
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
                <p className="text-body-s font-regular text-light-grey-muted flex items-center gap-1">
                    <TicketIconGrey />
                    {session.seatsLeft} left
                </p>
            </div>
        </div>
    );
};

const MovieSessions = ({
    venues,
    availableDates,
    profileComplete,
}: MovieSessionsProps) => {
    const [selectedDate, setSelectedDate] = useState(availableDates[0] ?? '');
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const visibleVenues = venues
        .map((group) => ({
            ...group,
            sessions: group.sessions.filter(
                (session) => session.date === selectedDate,
            ),
        }))
        .filter((group) => group.sessions.length > 0);

    const onHallClick = () => {
        if (!profileComplete) setProfileModalOpen(true);
    };

    return (
        <div className="flex w-3/4 flex-col">
            <h2 className="text-h2 mb-6 font-extrabold text-white">Sessions</h2>

            <div className="mb-6 flex flex-row gap-1.75">
                {availableDates.map((date) => {
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
                {visibleVenues.length === 0 ? (
                    <p className="text-helper-red text-[32px] font-extrabold">
                        NO AVAILABLE SESSIONS
                    </p>
                ) : (
                    visibleVenues.map((group) => {
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
                                            onClick={onHallClick}
                                            className={`bg-background-secondary flex w-[fit] flex-col gap-2 p-4 rounded-[18px]${
                                                profileComplete
                                                    ? ''
                                                    : 'cursor-pointer'
                                            }`}
                                        >
                                            <p className="text-label-s font-semibold text-white">
                                                Hall {hallName}
                                            </p>
                                            <div className="flex flex-row gap-2">
                                                {sessions.map((session) => (
                                                    <SessionTicket
                                                        key={session.id}
                                                        session={session}
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

            {profileModalOpen && (
                <CompleteProfileModal
                    onClose={() => setProfileModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MovieSessions;
