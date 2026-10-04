export const SearchIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.96867 7.96867L11 11M9.25 4.875C9.25 7.29125 7.29125 9.25 4.875 9.25C2.45875 9.25 0.5 7.29125 0.5 4.875C0.5 2.45875 2.45875 0.5 4.875 0.5C7.29125 0.5 9.25 2.45875 9.25 4.875Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default SearchIcon;
