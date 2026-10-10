import MyTickets from '@/pages/profile-page/components/my-tickets';
import PersonalInformation from '@/pages/profile-page/components/personal-info';
import { useTickets } from '@/react-query/query';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Tab = 'personal' | 'tickets';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const activeTab: Tab =
        params.get('tab') === 'tickets' ? 'tickets' : 'personal';
    const { data: orders = [] } = useTickets();
    const upcomingCount = orders.filter((order) => {
        const start = new Date(
            `${order.session.date}T${order.session.time}:00`,
        ).getTime();
        const refunded =
            order.refundedAt != null &&
            new Date(order.refundedAt).getTime() <= Date.now();
        return start > Date.now() && !refunded;
    }).length;
    const chooseTab = (tab: Tab) => {
        navigate(tab === 'tickets' ? '/profile?tab=tickets' : '/profile');
    };

    return (
        <div className="w-full self-start pt-1.75">
            <h1 className="text-h1 pl-15 font-extrabold text-white">
                My Profile
            </h1>

            <div className="mt-7 flex flex-row gap-8 pl-15">
                <button
                    type="button"
                    onClick={() => chooseTab('personal')}
                    className="flex flex-col gap-3.5"
                >
                    <p className="text-label-m cursor-pointer font-semibold text-white">
                        Personal Information
                    </p>
                    {activeTab === 'personal' && (
                        <div className="bg-helper-red h-px w-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => chooseTab('tickets')}
                    className="flex flex-col gap-3.5"
                >
                    <span className="flex items-center gap-2">
                        <p className="text-label-m cursor pointer font-semibold text-white">
                            My Tickets
                        </p>
                        <span className="text-label-s bg-helper-red rounded-full px-1.5 py-0.5 font-semibold text-white">
                            {upcomingCount}
                        </span>
                    </span>
                    {activeTab === 'tickets' && (
                        <div className="bg-helper-red h-px w-full" />
                    )}
                </button>
            </div>
            <div className="bg-background-secondary mx-15 h-px w-full" />

            <div
                className={
                    activeTab === 'personal'
                        ? 'mt-10 w-220'
                        : 'mt-10 w-full px-15'
                }
            >
                {activeTab === 'personal' ? (
                    <PersonalInformation />
                ) : (
                    <MyTickets />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
