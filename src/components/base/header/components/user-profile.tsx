import { useState } from 'react';
import DropDownArrow from '@/assets/drop-down-arrow';
import ProfileIncomplete from '@/assets/profile-incomplete';
import ProfileComplete from '@/assets/profile-complete';
import { useMe } from '@/react-query/query';
import { userAtom } from '@/store/auth';
import { useAtomValue } from 'jotai';
import ProfileDropDown from '@/components/base/header/components/profile-drop-down';

const UserProfile = () => {
    const user = useAtomValue(userAtom);
    const { data: me, isLoading } = useMe();
    const [open, setOpen] = useState(false);

    if (!user?.token) return null;
    if (isLoading || !me) return null;

    const isComplete = me.profileComplete;

    let avatarText = '';
    let labelText = '';

    if (isComplete && me.fullName) {
        const parts = me.fullName.trim().split(/\s+/);
        const firstName = parts[0] ?? '';
        const lastName = parts[1] ?? '';
        avatarText = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
        labelText = firstName;
    } else {
        avatarText = (me.username?.[0] ?? '').toUpperCase();
        labelText = me.username?.slice(0, 4) ?? '';
    }

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-6">
                <div className="flex flex-row items-center gap-3 font-semibold text-white">
                    <div className="bg-background-secondary relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
                        {me.avatar ? (
                            <img
                                src={me.avatar}
                                alt={me.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <p className="text-label-s">{avatarText}</p>
                        )}
                        <span className="absolute right-0 bottom-0 leading-none">
                            {isComplete ? (
                                <ProfileComplete />
                            ) : (
                                <ProfileIncomplete />
                            )}
                        </span>
                    </div>
                    <p className="text-label-m">{labelText}</p>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="cursor-pointer"
                    aria-expanded={open}
                >
                    <span
                        className={`inline-flex transition-transform ${open ? 'rotate-180' : ''}`}
                    >
                        <DropDownArrow />
                    </span>
                </button>
            </div>

            {open && (
                <div className="absolute top-full right-0 z-50 mt-1 min-w-70">
                    <ProfileDropDown me={me} />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
