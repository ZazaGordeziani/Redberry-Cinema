import Authorization from '@/components/base/header/components/authorization';
import SearchBar from '@/components/base/header/components/search-bar';

const Header = () => {
    return (
        <header className="h-27.75 w-full bg-[linear-gradient(to_bottom,#000000_0%,#000000_51%,transparent_100%)] px-15 pt-7.5 pb-10">
            <div className="flex justify-between">
                <div className="row flex max-h-5.5 items-center gap-9">
                    <h2 className="text-h2 flex gap-1.5 font-extrabold text-white">
                        KINO <span className="text-helper-red">XII</span>
                    </h2>
                    <h3 className="text-body-s tracking-overline pt-0.5 font-semibold text-white">
                        SESSIONS
                    </h3>
                </div>
                <div className="flex gap-8">
                    <SearchBar />
                    <Authorization />
                </div>
            </div>
        </header>
    );
};

export default Header;
