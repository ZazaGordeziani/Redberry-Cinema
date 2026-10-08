import Authorization from '@/components/base/header/components/authorization';
import SearchBar from '@/components/base/header/components/search-bar';
import UserProfile from '@/components/base/header/components/user-profile';
import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const user = useAtomValue(userAtom);
    const { pathname } = useLocation();
    const isHeroLayout =
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname.startsWith('/movies/');
    return (
        <header
            className={`z-50 h-27.75 w-full px-15 pt-7.5 pb-10 ${
                isHeroLayout
                    ? 'absolute top-0 right-0 left-0 bg-transparent'
                    : 'relative bg-[linear-gradient(to_bottom,#000000_0%,#000000_51%,transparent_100%)]'
            }`}
        >
            <div className="flex justify-between">
                <div className="row flex max-h-5.5 items-center gap-9">
                    <Link to="/" className="cursor-pointer">
                        <h2 className="text-h2 flex gap-1.5 font-extrabold text-white">
                            KINO <span className="text-helper-red">XII</span>
                        </h2>
                    </Link>
                    <h3 className="text-body-s tracking-overline pt-0.5 font-semibold text-white">
                        SESSIONS
                    </h3>
                </div>
                <div className="flex gap-8">
                    <SearchBar />
                    {user?.token ? <UserProfile /> : <Authorization />}
                </div>
            </div>
        </header>
    );
};

export default Header;
