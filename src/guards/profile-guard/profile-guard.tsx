import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
const ProfileGuard = () => {
    const user = useAtomValue(userAtom);
    const location = useLocation();
    if (!user?.token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Outlet />;
};
export default ProfileGuard;
