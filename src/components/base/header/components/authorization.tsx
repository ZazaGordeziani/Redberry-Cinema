import { useLocation, useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';

const Authorization = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user] = useAtom(userAtom);
    if (user?.token) {
        return null;
    }

    const stayHere = {
        pathname: location.pathname,
        search: location.search,
    };

    return (
        <div className="text-body-m flex gap-3 leading-[100%] font-extrabold tracking-normal">
            <button
                type="button"
                onClick={() =>
                    navigate(stayHere, { state: { register: true } })
                }
                className="button button-primary button-primary-sign-up cursor-pointer text-white"
            >
                Sign up
            </button>
            <button
                type="button"
                className="button button-login text-background cursor-pointer"
                onClick={() => navigate(stayHere, { state: { login: true } })}
            >
                Log in
            </button>
        </div>
    );
};

export default Authorization;
