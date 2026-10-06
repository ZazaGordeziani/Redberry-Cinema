import { login, logout, register, updateProfile } from '@/api/auth';
import type {
    LoginResponse,
    MeResponse,
    RegisterResponse,
    UpdateProfilePayload,
} from '@/api/auth/index.types';
import type { LoginFormValues } from '@/components/authorization/modals/login/components/index.types';
import type { RegisterFormValues } from '@/components/authorization/modals/register/components/index.types';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

export const useLogin = (
    options?: UseMutationOptions<LoginResponse, AxiosError, LoginFormValues>,
) => {
    return useMutation<LoginResponse, AxiosError, LoginFormValues>({
        mutationFn: (formData: LoginFormValues) => login({ payload: formData }),
        ...options,
    });
};
export const useRegister = (
    options?: UseMutationOptions<
        RegisterResponse,
        AxiosError,
        RegisterFormValues
    >,
) => {
    return useMutation<RegisterResponse, AxiosError, RegisterFormValues>({
        mutationFn: (formData: RegisterFormValues) =>
            register({
                ...formData,
                avatar: formData.avatar ?? null,
            }),
        ...options,
    });
};
export const useLogout = (
    options?: UseMutationOptions<void, AxiosError, void>,
) => {
    return useMutation<void, AxiosError, void>({
        mutationFn: logout,
        ...options,
    });
};

export const useUpdateProfile = (
    options?: UseMutationOptions<MeResponse, AxiosError, UpdateProfilePayload>,
) => {
    return useMutation({
        mutationFn: updateProfile,
        ...options,
    });
};
