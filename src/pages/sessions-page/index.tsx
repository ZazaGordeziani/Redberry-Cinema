import Filters from '@/pages/sessions-page/components/filters';

const SessionsPage = () => {
    return (
        <section className="w-full px-15 pt-8">
            <h1 className="text-h1 font-extrabold text-white">Sessions</h1>
            <p className="text-body-m font-regular text-light-grey-muted mt-1.5">
                Browse showtimes across all venues
            </p>

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-15">
                <Filters />
                <div />
            </div>
        </section>
    );
};

export default SessionsPage;
