import { httpClient } from '@/api';
import { AUTH_ENDPONTS } from '@/api/auth/index.enum';
import type { LoginPayload } from '@/api/auth/index.types';
import type { RegisterFormValues } from '@/components/authorization/modals/register/components/index.types';
import type { UpdateProfilePayload } from '@/api/auth/index.types';

//login
export const login = async ({ payload }: LoginPayload) => {
    const response = await httpClient.post(AUTH_ENDPONTS.LOGIN, payload);
    return response.data.data;
};

//register
export const register = async (form: RegisterFormValues) => {
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('password_confirmation', form.confirmPassword);
    if (form.avatar) formData.append('avatar', form.avatar);

    const response = await httpClient.post(AUTH_ENDPONTS.REGISTER, formData);

    return response.data.data;
};

//get profile
export const getMe = async () => {
    const response = await httpClient.get(AUTH_ENDPONTS.ME);
    return response.data.data;
};

//logout
export const logout = async () => {
    await httpClient.post(AUTH_ENDPONTS.LOGOUT);
};

//profile update
export const updateProfile = async (payload: UpdateProfilePayload) => {
    const formData = new FormData();
    formData.append('fullName', payload.fullName);
    formData.append('mobileNumber', payload.mobileNumber.replace(/\s+/g, ''));
    formData.append('dateOfBirth', payload.dateOfBirth);
    if (payload.preferredVenueId != null) {
        formData.append('preferredVenueId', String(payload.preferredVenueId));
    }
    if (payload.avatar) {
        formData.append('avatar', payload.avatar);
    }
    const response = await httpClient.put(AUTH_ENDPONTS.PROFILE, formData);

    return response.data.data;
};
