import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type LocationState = {
    from?: {
        pathname: string;
        search: string;
    };
};

const AuthGuard = ({ children }: PropsWithChildren) => {
    const user = useAtomValue(userAtom);
    const location = useLocation() as { state: LocationState | null };

    const from = location.state?.from;
    const toNavigate = from ? `${from.pathname}${from.search}` : '/';

    if (user?.token) {
        return <Navigate to={toNavigate} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
