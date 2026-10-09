import CloseSign from '@/assets/close-sign';
import PopcornIcon from '@/assets/popcorn-icon';
import SearchIcon from '@/assets/search-icon';
import SearchIconBig from '@/assets/search-icon-big';
import { useSearchMovies } from '@/react-query/query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const highlightTitle = (title: string, query: string) => {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = title.split(new RegExp(`(${escaped})`, 'ig'));

    return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="text-white">
                {part}
            </span>
        ) : (
            <span key={index}>{part}</span>
        ),
    );
};

export const SearchBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const { data: results = [], isFetching } = useSearchMovies(query);
    const noResults = query !== '' && !isFetching && results.length === 0;

    return (
        <form
            onReset={() => setQuery('')}
            className="group row bg-tint-white relative flex w-95 items-center gap-1 rounded-[999px] px-3.5 py-1.5"
        >
            <SearchIcon className="group-focus-within:invisible group-has-[input:not(:placeholder-shown)]:visible" />
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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

            {focused && (query === '' || noResults) && (
                <div
                    onMouseDown={(event) => event.preventDefault()}
                    className="bg-background border-background-tertiary absolute top-full left-0 z-50 mt-1 h-62 w-full rounded-2xl border"
                >
                    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 pt-8 pb-7">
                        {noResults ? <SearchIconBig /> : <PopcornIcon />}
                        <div className="flex flex-col items-center">
                            <p className="text-label-m text-center font-semibold text-white">
                                {noResults
                                    ? `No results for "${query}"`
                                    : 'What do you want to watch?'}
                            </p>
                            <p className="text-body-m font-regular text-light-grey-muted mt-1.5 text-center">
                                {noResults
                                    ? 'Check the spelling or try another film or live event.'
                                    : 'Search by title, director or cast'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/sessions')}
                            className="text-label-m cursor-pointer rounded-[999px] bg-[#FFFFFF1A] px-5.5 py-3.25 font-extrabold text-white"
                        >
                            Browse all sessions
                        </button>
                    </div>
                </div>
            )}

            {focused && query !== '' && results.length > 0 && (
                <div
                    onMouseDown={(event) => event.preventDefault()}
                    className="bg-background border-background-tertiary [&::-webkit-scrollbar-thumb]:bg-helper-red absolute top-full left-0 z-50 mt-1 max-h-85.5 w-full [scrollbar-color:#EC3013_transparent] overflow-y-auto rounded-2xl border [scrollbar:thin] [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent"
                >
                    <div className="flex items-center justify-between px-5 pt-3 pb-1.5">
                        <p className="text-label-s tracking-overline text-light-grey-muted font-semibold">
                            FILMS & EVENTS
                        </p>
                        <p className="text-body-s font-regular text-light-grey-muted">
                            {results.length} results
                        </p>
                    </div>

                    <div className="mt-2 flex flex-col">
                        {results.map((movie) => (
                            <button
                                key={movie.id}
                                type="button"
                                onClick={() =>
                                    navigate(`/movies/${movie.slug}`)
                                }
                                className="flex h-18 w-full items-center rounded-[10px] py-2 pr-5 pl-5 hover:cursor-pointer hover:bg-[#FFFFFF1A]"
                            >
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="h-14 w-11 shrink-0 rounded object-cover"
                                />

                                <div className="ml-4 flex min-w-0 flex-1 flex-col">
                                    <p className="text-label-m text-light-grey-muted truncate text-left font-semibold">
                                        {highlightTitle(movie.title, query)}
                                    </p>
                                    <p className="text-body-s font-regular text-light-grey-muted mt-1 text-left">
                                        Film · {movie.ageRating.minAge}+ ·{' '}
                                        {movie.runtimeMinutes} min
                                    </p>
                                </div>

                                {movie.isComingSoon ? (
                                    <p className="text-label-m text-helper-orange shrink-0 font-semibold">
                                        Coming soon
                                    </p>
                                ) : (
                                    <p className="text-label-s shrink-0 font-semibold text-white">
                                        from ₾{movie.fromPrice}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </form>
    );
};

export default SearchBar;
