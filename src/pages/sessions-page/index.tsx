import Filters from '@/pages/sessions-page/components/filters';
import Pagination from '@/pages/sessions-page/components/pagination';
import SessionResults from '@/pages/sessions-page/components/session-results';
import qs from 'qs';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SessionsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [lastPage, setLastPage] = useState(1);
    const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    const page = Number(parsed.page) || 1;

    const goToPage = (nextPage: number) => {
        const next = qs.parse(location.search, { ignoreQueryPrefix: true });
        if (nextPage <= 1) delete next.page;
        else next.page = String(nextPage);

        navigate({
            pathname: location.pathname,
            search: qs.stringify(next, {
                arrayFormat: 'repeat',
                skipNulls: true,
            }),
        });
    };

    return (
        <section className="w-full px-15 pt-8">
            <h1 className="text-h1 font-extrabold text-white">Sessions</h1>
            <p className="text-body-m font-regular text-light-grey-muted mt-1.5">
                Browse showtimes across all venues
            </p>

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(0,5fr)] gap-15">
                <Filters />
                <SessionResults onLastPage={setLastPage} />
            </div>

            <div className="mt-15 ml-33 flex justify-center">
                {lastPage > 0 && (
                    <div className="mt-15 ml-33 flex justify-center">
                        <Pagination
                            page={page}
                            lastPage={lastPage}
                            onPageChange={goToPage}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default SessionsPage;
