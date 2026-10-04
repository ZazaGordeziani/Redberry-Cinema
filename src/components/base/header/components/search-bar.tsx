import CloseSign from '@/assets/close-sign';
import SearchIcon from '@/assets/search-icon';

export const SearchBar = () => {
    return (
        <form className="group row bg-tint-white flex w-95 items-center gap-1 rounded-[999px] px-3.5 py-1.5">
            <SearchIcon className="group-focus-within:invisible group-has-[input:not(:placeholder-shown)]:visible" />
            <input
                className="font-regular text-body-m focus:placeholder:text-dark-grey w-full text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Search films and live events"
            />
            <button
                type="reset"
                className="bg-tint-white invisible rounded-[999px] group-has-[input:not(:placeholder-shown)]:visible"
            >
                <CloseSign className="h-6 w-6 cursor-pointer p-1" />
            </button>
        </form>
    );
};

export default SearchBar;
