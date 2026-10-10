import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';

export type BookingSummary = {
    sessionId: number;
    movieTitle: string;
    minAge: number;
    venueName: string;
    hallName: string;
    date: string;
    time: string;
    formatName: string;
    languageName: string;
    price: number;
};

export const useOpenSession = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAtomValue(userAtom);

    return (summary: BookingSummary) => {
        const next = qs.parse(location.search, { ignoreQueryPrefix: true });
        next.booking = String(summary.sessionId);

        const search = qs.stringify(next, {
            arrayFormat: 'repeat',
            skipNulls: true,
        });

        navigate(
            { pathname: location.pathname, search },
            {
                state: user?.token
                    ? { booking: summary }
                    : { login: true, booking: summary },
            },
        );
    };
};
