import PersonalInformation from '@/pages/profile-page/components/personal-info';
import { useState } from 'react';

type Tab = 'personal' | 'tickets';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('personal');

    return (
        <div className="w-full self-start pt-1.75 pl-12.75">
            <h1 className="text-h1 font-extrabold text-white">My Profile</h1>

            <div className="mt-7 flex flex-row gap-8">
                <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="flex flex-col gap-3.5"
                >
                    <p className="text-label-m font-semibold text-white">
                        Personal Information
                    </p>
                    {activeTab === 'personal' && (
                        <div className="bg-helper-red h-px w-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('tickets')}
                    className="flex flex-col gap-3.5"
                >
                    <p className="text-label-m font-semibold text-white">
                        My Tickets
                    </p>
                    {activeTab === 'tickets' && (
                        <div className="bg-helper-red h-px w-full" />
                    )}
                </button>
            </div>

            <div className="mt-10 w-220">
                {activeTab === 'personal' ? (
                    <PersonalInformation />
                ) : (
                    <div className="text-light-grey-muted">My tickets soon</div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
