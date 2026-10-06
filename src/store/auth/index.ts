import { atomWithStorage } from 'jotai/utils';
export type User = {
    username?: string;
    avatar?: string;
    email?: string;
    token?: string;
} | null;
export const userAtom = atomWithStorage<User>('user', null, undefined, {
    getOnInit: true,
});
