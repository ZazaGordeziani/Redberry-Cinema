import PaginationLeftArrow from '@/assets/pagination-left-arrow';
import PaginationRightArrow from '@/assets/pagination-right-arrow';

const buildPages = (current: number, total: number) => {
    const candidateSet = new Set<number>();
    candidateSet.add(1);
    candidateSet.add(total);
    candidateSet.add(current);
    if (current - 1 >= 1) candidateSet.add(current - 1);
    if (current + 1 <= total) candidateSet.add(current + 1);
    const sortedPages = Array.from(candidateSet)
        .filter((item) => item >= 1 && item <= total)
        .sort((a, b) => a - b);

    const pages: Array<number | '...'> = [];

    for (let i = 0; i < sortedPages.length; i++) {
        pages.push(sortedPages[i]);
        if (
            i < sortedPages.length - 1 &&
            sortedPages[i + 1] - sortedPages[i] > 1
        ) {
            pages.push('...');
        }
    }

    return pages;
};

const Pagination = ({
    page,
    lastPage,
    onPageChange,
}: {
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}) => {
    const pages = buildPages(page, lastPage);

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

            {pages.map((item, index) =>
                item === '...' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="text-label-m text-light-grey-muted flex h-10 w-10 items-center justify-center font-semibold"
                    >
                        ...
                    </span>
                ) : (
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
                ),
            )}

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
