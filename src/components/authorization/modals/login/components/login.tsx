import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, type Location } from 'react-router';

import { useLogin } from '@/react-query/mutation';
import type { LoginResponse } from '@/api/auth/index.types';
import { httpClient } from '@/api';
import { userAtom } from '@/store/auth';
import { useAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginFormSchema } from '@/components/authorization/modals/login/components/schema';
import type { LoginFormValues } from '@/components/authorization/modals/login/components/index.types';
import CloseSign from '@/assets/close-sign';
import CheckMark from '@/assets/check-mark';
import ExclamationMark from '@/assets/exclamation-mark';

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation() as Location & {
        state: LocationState;
    };
    const [, setUser] = useAtom(userAtom);
    const openedHere = Boolean(location.state?.login);

    type LocationState = {
        from?: Location;
        login?: boolean;
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
        reset,
        trigger,
        clearErrors,
        formState: { isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: LoginFormDefaultValues,
        mode: 'onBlur',
    });

    const { mutate: handleLogin } = useLogin({
        onSuccess: (data: LoginResponse) => {
            console.log('Login response:', data);
            console.log('Access token:', data.token);

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
            if (location.state?.login) {
                navigate(location.pathname, { replace: true });
                return;
            }

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
    if (location.pathname !== '/login' && !openedHere) {
        return null;
    }

    const handleClose = () => {
        reset();
        if (location.state?.login) {
            navigate(location.pathname, { replace: true, state: null });
            return;
        }
        navigate('/');
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs"
            onClick={handleClose}
        >
            <section
                className="bg-background border-background-tertiary flex w-100.75 flex-col gap-6 rounded-[28px] border p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-h2 font-extrabold text-white">
                            Log in
                        </h2>
                        <p className="text-light-grey-muted text-body-s font-regular">
                            Welcome back to Kino XII
                        </p>
                    </div>
                    <button type="submit" onClick={handleClose}>
                        <CloseSign className="h-6 w-6 cursor-pointer" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    <div className="flex flex-col gap-6">
                        <Controller
                            name="email"
                            control={control}
                            render={({
                                field: { onChange, value, onBlur },
                                fieldState: { error, isTouched },
                            }) => {
                                const hasError = !!error;
                                const isValid =
                                    isTouched && !error && value.length > 0;

                                return (
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="email"
                                            className={`text-label-s font-semibold ${
                                                hasError
                                                    ? 'text-helper-red'
                                                    : 'text-white'
                                            }`}
                                        >
                                            Email
                                        </label>

                                        <div className="relative">
                                            <input
                                                onChange={onChange}
                                                onBlur={() => {
                                                    if (
                                                        error?.type === 'server'
                                                    ) {
                                                        clearErrors('email');
                                                    }

                                                    onBlur();
                                                }}
                                                value={value}
                                                className={`input-default outline-none ${hasError ? 'border-helper-red input-error text-helper-red placeholder:text-helper-red placeholder:text-label-s border' : 'placeholder:text-label-s placeholder:text-light-grey-muted placeholder:font-semibold'}`}
                                                placeholder="example@gmail.com"
                                            />{' '}
                                            {isValid && (
                                                <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                            )}
                                            {hasError && (
                                                <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                            )}
                                        </div>
                                        {error?.type !== 'server' &&
                                            error?.message && (
                                                <span className="text-helper-red text-label-s font-semibold">
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
                                field: { onChange, value, onBlur },
                                fieldState: { error, invalid },
                            }) => {
                                const hasError = !!error;
                                const isValid = !invalid && value.length >= 3;

                                return (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="password"
                                                className={`text-label-s font-semibold ${
                                                    hasError
                                                        ? 'text-helper-red'
                                                        : 'text-white'
                                                }`}
                                            >
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={(event) => {
                                                        onChange(event);
                                                        trigger('password');
                                                    }}
                                                    className={`input-default outline-none ${hasError ? 'border-helper-red placeholder:text-helper-red text-helper-red border' : ''}`}
                                                    placeholder="••••••••"
                                                />
                                                {isValid && (
                                                    <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                                {hasError && (
                                                    <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                            </div>
                                            {error?.message && (
                                                <span className="text-helper-red text-label-s font-semibold">
                                                    {error.message}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                );
                            }}
                        />

                        <div className="mt-2 flex flex-col justify-center gap-6">
                            <button
                                type="submit"
                                onClick={() => console.log('clicked on button')}
                                disabled={!isValid}
                                className={`text-label-m flex h-10.25 items-center justify-center rounded-[999px] font-extrabold ${
                                    isValid
                                        ? 'bg-helper-red cursor-pointer text-white'
                                        : 'bg-dark-grey text-light-grey-muted'
                                }`}
                            >
                                Log in
                            </button>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-body-m font-regular text-light-grey-muted">
                                    Don&apos;t have an account?
                                </p>

                                <Link
                                    to={
                                        openedHere
                                            ? {
                                                  pathname: location.pathname,
                                                  search: location.search,
                                              }
                                            : '/register'
                                    }
                                    state={
                                        openedHere
                                            ? { register: true }
                                            : undefined
                                    }
                                >
                                    {' '}
                                    <button>
                                        <span className="text-helper-red text-label-m font-extrabold">
                                            Sign up
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
