import CheckMark from '@/assets/check-mark';
import ProfileComplete from '@/assets/profile-complete';
import ProfileIncomplete from '@/assets/profile-incomplete';
import type { MeResponse } from '@/api/auth/index.types';
import { httpClient } from '@/api';
import { useLogout } from '@/react-query/mutation';
import { userAtom } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import LogOutIcon from '@/assets/log-out-icon';
import TicketIcon from '@/assets/ticket-icon';
import ProfileIcon from '@/assets/profile-icon';

type ProfileDropDownProps = {
    me: MeResponse;
};

const ProfileDropDown = ({ me }: ProfileDropDownProps) => {
    const setUser = useSetAtom(userAtom);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const clearAuthStorage = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('avatar');
        delete httpClient.defaults.headers.common['Authorization'];
        queryClient.removeQueries({ queryKey: ['me'] });
    };

    const { mutate: handleLogout } = useLogout({
        onSettled: () => {
            clearAuthStorage();
            navigate('/');
        },
    });

    const isComplete = me.profileComplete;

    let avatarText = '';
    let fullNameText = '';

    if (isComplete && me.fullName) {
        const parts = me.fullName.trim().split(/\s+/);
        const firstName = parts[0] ?? '';
        const lastName = parts[1] ?? '';
        avatarText = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
        fullNameText = me.fullName;
    } else {
        avatarText = (me.username?.[0] ?? '').toUpperCase();
        fullNameText = me.username ?? '';
    }

    return (
        <div className="bg-background flex w-75.5 flex-col rounded-2xl p-5">
            <div className="flex flex-row items-center gap-2.5">
                <div className="bg-background-secondary relative flex h-10.5 w-10.5 items-center justify-center overflow-hidden rounded-lg">
                    {me.avatar ? (
                        <img
                            src={me.avatar}
                            alt={me.username}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <p className="text-label-s font-semibold text-white">
                            {avatarText}
                        </p>
                    )}

                    <span className="absolute right-0 bottom-0 leading-none">
                        {isComplete ? (
                            <ProfileComplete />
                        ) : (
                            <ProfileIncomplete />
                        )}
                    </span>
                </div>

                <div className="flex flex-col gap-0.5">
                    <p className="text-label-m font-semibold text-white">
                        {fullNameText}
                    </p>
                    <p className="text-body-s font-regular text-light-grey-muted">
                        {me.email}
                    </p>
                </div>
            </div>

            <div
                className={`mt-4 rounded-[10px] px-3 py-2.5 ${
                    isComplete ? 'bg-tint-green' : 'bg-[#E27E041A]'
                }`}
            >
                {isComplete ? (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2.5">
                            <CheckMark className="text-helper-green h-4 w-4" />
                            <h4 className="text-label-m text-helper-green font-semibold">
                                Profile complete
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-label-m text-helper-orange font-semibold">
                            Profile incomplete
                        </h4>
                        <p className="text-body-s font-regular text-light-grey-muted">
                            Please complete your profile to enable <br />{' '}
                            booking.
                        </p>
                    </div>
                )}
            </div>

            {/* Links */}
            <div className="mt-5 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <ProfileIcon />
                    <p className="text-label-m cursor-pointer font-semibold text-white">
                        My profile
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <TicketIcon />
                    <p className="text-label-m cursor-pointer font-semibold text-white">
                        My tickets
                    </p>
                </div>
            </div>

            <div className="bg-tint-white -mx-5 mt-4 h-px" />
            <div className="mt-4 flex items-center gap-2">
                <p>
                    <LogOutIcon />
                </p>
                <button
                    type="button"
                    onClick={() => handleLogout()}
                    className="text-label-m text-helper-red cursor-pointer self-start font-semibold"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default ProfileDropDown;
