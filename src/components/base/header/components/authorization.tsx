import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';

const Authorization = () => {
    const navigate = useNavigate();
    const [user] = useAtom(userAtom);
    if (user?.token) {
        return null;
    }
    return (
        <div className="text-body-m flex gap-3 leading-[100%] font-extrabold tracking-normal">
            <button
                type="button"
                onClick={() => navigate('/register')}
                className="button button-primary button-primary-sign-up cursor-pointer text-white"
            >
                Sign up
            </button>
            <button
                type="button"
                className="button button-login text-background cursor-pointer"
                onClick={() => navigate('/login')}
            >
                Log in
            </button>
        </div>
    );
};

export default Authorization;
