import { getMe } from '@/api/auth';
import { userAtom } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

export const useMe = () => {
    const user = useAtomValue(userAtom);
    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        enabled: !!user?.token,
    });
};
