import PaginationLeftArrow from '@/assets/pagination-left-arrow';
import PaginationRightArrow from '@/assets/pagination-right-arrow';

const Pagination = ({
    page,
    lastPage,
    onPageChange,
}: {
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}) => {
    const pages = Array.from({ length: lastPage }, (_, index) => index + 1);

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="bg-background-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-[999px] disabled:cursor-default disabled:opacity-40"
            >
                <PaginationLeftArrow />
            </button>

            {pages.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onPageChange(item)}
                    className={`text-label-m flex h-10 w-10 cursor-pointer items-center justify-center rounded-[999px] font-semibold ${
                        item === page
                            ? 'bg-helper-red text-white'
                            : 'text-light-grey-muted'
                    }`}
                >
                    {item}
                </button>
            ))}

            <button
                type="button"
                aria-label="Next page"
                disabled={page === lastPage}
                onClick={() => onPageChange(page + 1)}
                className="bg-background-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-[999px] disabled:cursor-default disabled:opacity-40"
            >
                <PaginationRightArrow />
            </button>
        </div>
    );
};

export default Pagination;
