import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, type Location } from 'react-router';

import { useLogin } from '@/react-query/mutation';
import type { LoginResponse } from '@/api/auth/index.types';
import { httpClient } from '@/api';
import { userAtom } from '@/store/auth';
import { useAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from '@/components/authorization/modals/assets/eye';
import { SlashEye } from '@/components/authorization/modals/assets/slash-eye';
import { LoginFormSchema } from '@/components/authorization/modals/login/components/schema';
import type { LoginFormValues } from '@/components/authorization/modals/login/components/index.types';
import CloseSign from '@/assets/close-sign';

export const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [, setUser] = useAtom(userAtom);

    type LocationState = {
        from?: Location;
    };

    const navigate = useNavigate();
    const location = useLocation() as Location & {
        state: LocationState;
    };
    const from = location.state?.from
        ? location.state?.from?.pathname + location.state?.from?.search
        : '/';

    const LoginFormDefaultValues = {
        email: '',
        password: '',
    };

    const {
        control,

        handleSubmit,
        setError,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: LoginFormDefaultValues,
        mode: 'onBlur',
    });

    const { mutate: handleLogin } = useLogin({
        onSuccess: (data: LoginResponse) => {
            if (data.token) localStorage.setItem('token', data.token);
            if (data.user?.username)
                localStorage.setItem('username', data.user.username);
            if (data.user?.avatar)
                localStorage.setItem('avatar', data.user.avatar);
            if (data.user?.email)
                localStorage.setItem('email', data.user.email);
            setUser({
                username: data.user?.username,
                avatar: data.user?.avatar || undefined,
                token: data.token,
            });
            httpClient.defaults.headers.common['Authorization'] =
                `Bearer ${data.token}`;

            navigate(from, { replace: true });
        },
        onError: () => {
            setError('email', {
                type: 'server',
                message: 'Invalid login credentials',
            });
            setError('password', {
                type: 'server',
                message: 'Invalid login credentials',
            });
        },
    });

    const onSubmit = (formData: LoginFormValues) => {
        handleLogin(formData);
    };
    if (location.pathname !== '/login') {
        return null;
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => navigate('/')}
        >
            <section
                className="bg-background flex h-100 w-100.75 flex-col gap-6 rounded-[28px] p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-h2 text-white">Log in</h2>
                        <p className="text-light-grey-muted text-body-s font-regular">
                            Welcome back to Kino XII
                        </p>
                    </div>
                    <button type="submit" onClick={() => navigate('/')}>
                        <CloseSign className="h-6 w-6 cursor-pointer" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    <div className="flex flex-col gap-6">
                        <Controller
                            name="email"
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => {
                                const hasError = !!error;
                                return (
                                    <div className="flex flex-col">
                                        <div className="relative">
                                            <input
                                                onChange={onChange}
                                                value={value}
                                                className={`input-default ${hasError ? 'border-orange-600' : ''}`}
                                                placeholder="E-mail"
                                            />
                                        </div>
                                        {error?.type !== 'server' &&
                                            error?.message && (
                                                <span className="mt-3 block text-red-500">
                                                    {error.message}
                                                </span>
                                            )}
                                    </div>
                                );
                            }}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => {
                                const hasServerError = error?.type === 'server';

                                return (
                                    <>
                                        <div className="flex flex-col">
                                            <div className="relative">
                                                <input
                                                    value={value}
                                                    onChange={onChange}
                                                    className={`input-default ${hasServerError ? 'border-orange-600' : ''}`}
                                                    placeholder="Password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-black"
                                                >
                                                    {showPassword ? (
                                                        <Eye />
                                                    ) : (
                                                        <SlashEye />
                                                    )}
                                                </button>
                                            </div>
                                            {error?.message && (
                                                <span className="mt-3 block text-red-500">
                                                    {error.message}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                );
                            }}
                        />

                        <div className="mt-5 flex flex-col justify-center gap-6">
                            <button className="font-poppins flex h-[41px] items-center justify-center rounded-[10px] bg-orange-600 text-[14px] leading-[100%] font-normal text-white">
                                Log in
                            </button>
                            <div className="flex items-center justify-center gap-2">
                                <p className="font-poppins text-sm leading-[100%] font-normal tracking-[0px] text-zinc-700">
                                    Not a member?
                                </p>

                                <Link to={`/auth/register`}>
                                    <button>
                                        <span className="font-poppins text-sm leading-[100%] font-medium tracking-[0px] text-orange-600">
                                            Register
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};
