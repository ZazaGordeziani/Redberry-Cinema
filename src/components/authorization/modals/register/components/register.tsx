import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegister } from '@/react-query/mutation';

import { userAtom } from '@/store/auth';
import { useAtom } from 'jotai';
import {
    RegisterFormDefaultValues,
    type BackendErrorResponse,
    type RegisterFormValues,
} from '@/components/authorization/modals/register/components/index.types';
import { SignUpFormSchema } from '@/components/authorization/modals/register/components/schema';
import UploadIcon from '@/assets/upload-icon';
import CloseSign from '@/assets/close-sign';
import CheckMark from '@/assets/check-mark';
import ExclamationMark from '@/assets/exclamation-mark';

export const Register = () => {
    const avatarRef = useRef<HTMLInputElement>(null);

    const [, setUser] = useAtom(userAtom);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        control,
        trigger,
        setError,
        reset,
        clearErrors,
        handleSubmit,
        watch,
        formState: { isValid },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: RegisterFormDefaultValues,
        mode: 'onChange',
    });

    const usernameValue = watch('username');
    const firstLetter = usernameValue ? usernameValue[0].toUpperCase() : null;

    const { mutate: handleRegister } = useRegister({
        onError: (error) => {
            const data = error.response?.data as
                BackendErrorResponse | undefined;
            if (data?.errors) {
                const backendErrors = data.errors;
                const fieldMap: Record<string, keyof RegisterFormValues> = {
                    password_confirmation: 'confirmPassword',
                    username: 'username',
                    email: 'email',
                    password: 'password',
                    avatar: 'avatar',
                };

                Object.entries(backendErrors).forEach(([field, messages]) => {
                    const formField = fieldMap[field];
                    if (formField) {
                        setError(formField, {
                            type: 'server',
                            message: messages[0],
                        });
                    }
                });
            }
        },
        onSuccess: (data) => {
            console.log('successfully registered', data.token);
            navigate('/');
            setUser({
                email: data.user.email,
                token: data.token,
                username: data.user.username,
                avatar: data.user.avatar || undefined,
            });
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            if (data.user.avatar) {
                localStorage.setItem('avatar', data.user.avatar);
            }
        },
    });
    if (location.pathname !== '/register') {
        return null;
    }
    const onSubmit = (registerPayload: RegisterFormValues) => {
        handleRegister(registerPayload);
    };
    const handleClose = () => {
        reset();
        navigate('/');
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClose}
        >
            <div
                className="bg-background border-background-tertiary flex w-118.75 flex-col gap-6 rounded-[28px] border p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-h2 font-extrabold text-white">
                            Sign up
                        </h2>
                        <p className="text-light-grey-muted text-body-s font-regular">
                            Welcome to Kino XII
                        </p>
                    </div>
                    <button type="submit" onClick={handleClose}>
                        <CloseSign className="h-6 w-6 cursor-pointer" />
                    </button>
                </div>
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-8">
                        <Controller
                            name="avatar"
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => {
                                const handleClick = () => {
                                    avatarRef.current?.click();
                                };

                                const handleRemove = () => {
                                    onChange(null);
                                    if (avatarRef.current) {
                                        avatarRef.current.value = '';
                                    }
                                };

                                const handleFileChange = async (
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                            setError('avatar', {
                                                type: 'manual',
                                                message:
                                                    'File size must be less than 2MB',
                                            });
                                            if (avatarRef.current)
                                                avatarRef.current.value = '';
                                            return;
                                        }
                                        clearErrors('avatar');
                                        onChange(file);
                                    }
                                };

                                const previewUrl = value
                                    ? URL.createObjectURL(value)
                                    : null;

                                return (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                                            ref={avatarRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <div
                                            className="flex cursor-pointer items-center gap-4"
                                            onClick={handleClick}
                                            role="button"
                                            aria-label="Upload avatar"
                                        >
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Chosen avatar"
                                                    className="h-10 w-10 rounded-lg"
                                                />
                                            ) : firstLetter ? (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-400 text-3xl font-semibold text-white">
                                                    {firstLetter}{' '}
                                                </div>
                                            ) : (
                                                <UploadIcon />
                                            )}

                                            <div className="font-poppins text-sm leading-[100%] font-normal whitespace-nowrap text-white">
                                                {previewUrl ? (
                                                    <div className="flex gap-3">
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClick();
                                                            }}
                                                        >
                                                            Upload new
                                                        </span>
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemove();
                                                            }}
                                                        >
                                                            Remove
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-0.75">
                                                        <p className="text-label-m font-extrabold text-white">
                                                            Upload avatar
                                                            (optional)
                                                        </p>
                                                        <p className="font-regular text-body-s text-light-grey-muted">
                                                            JPG, PNG or WEBP
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {error && (
                                            <span className="text-helper-red">
                                                {error.message}
                                            </span>
                                        )}
                                    </>
                                );
                            }}
                        />
                        <div className="flex flex-col gap-6">
                            <Controller
                                name="username"
                                control={control}
                                render={({
                                    field: { onChange, value, onBlur },
                                    fieldState: { error, isTouched, invalid },
                                }) => {
                                    const hasError = !!error;
                                    const isFieldValid = isTouched && !invalid;
                                    return (
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="username"
                                                className={`text-label-s font-semibold ${
                                                    hasError
                                                        ? 'text-helper-red'
                                                        : 'text-white'
                                                }`}
                                            >
                                                Username
                                            </label>
                                            <div className="relative">
                                                {' '}
                                                <input
                                                    onChange={onChange}
                                                    onBlur={() => {
                                                        onBlur();
                                                        trigger('username');
                                                    }}
                                                    value={value}
                                                    className={`input-default outline-none ${hasError ? 'border-helper-red text-helper-red border' : ''}`}
                                                    placeholder="Username"
                                                />
                                                {isFieldValid && (
                                                    <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                                {hasError && (
                                                    <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                            </div>{' '}
                                            <div>
                                                {error?.message ? (
                                                    <span className="text-label-s text-helper-red font-semibold">
                                                        {error.message}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                            <Controller
                                name="email"
                                control={control}
                                render={({
                                    field: { onChange, value, onBlur },
                                    fieldState: { error, isTouched, invalid },
                                }) => {
                                    const hasError = !!error;
                                    const isFieldValid = isTouched && !invalid;

                                    return (
                                        <div className="flex flex-col gap-2">
                                            {' '}
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
                                                    value={value}
                                                    onBlur={() => {
                                                        onBlur();
                                                        trigger('email');
                                                    }}
                                                    className={`input-default outline-none ${hasError ? 'border-helper-red text-helper-red border' : ''}`}
                                                    placeholder="E-mail"
                                                />
                                                {isFieldValid && (
                                                    <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                                {hasError && (
                                                    <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                {error?.message ? (
                                                    <span className="text-label-s text-helper-red font-semibold">
                                                        {error.message}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <div className="flex w-full gap-3">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => {
                                        const hasError = !!error;
                                        return (
                                            <>
                                                {' '}
                                                <div className="flex w-full flex-col gap-2">
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
                                                            value={value}
                                                            onChange={onChange}
                                                            onBlur={() => {
                                                                trigger([
                                                                    'password',
                                                                    'confirmPassword',
                                                                ]);
                                                            }}
                                                            className={`input-default outline-none ${hasError ? 'border-helper-red text-helper-red border' : ''}`}
                                                            placeholder="Password"
                                                        />
                                                        {isValid && (
                                                            <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                                        )}
                                                        {hasError && (
                                                            <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                                        )}

                                                        <div className="mt-1">
                                                            {error?.message ? (
                                                                <span className="text-label-s text-helper-red font-semibold">
                                                                    {
                                                                        error.message
                                                                    }
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    }}
                                />

                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => {
                                        const hasError = !!error;
                                        return (
                                            <>
                                                <div className="flex w-full flex-col gap-2">
                                                    <label
                                                        htmlFor="confirmpassword"
                                                        className={`text-label-s font-semibold ${
                                                            hasError
                                                                ? 'text-helper-red'
                                                                : 'text-white'
                                                        }`}
                                                    >
                                                        Confirm assword
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            value={value}
                                                            onChange={onChange}
                                                            onBlur={() => {
                                                                trigger([
                                                                    'password',
                                                                    'confirmPassword',
                                                                ]);
                                                            }}
                                                            className={`input-default outline-none ${hasError ? 'border-helper-red text-helper-red border' : ''}`}
                                                            placeholder="Confirm password"
                                                        />
                                                        {isValid && (
                                                            <CheckMark className="text-helper-green absolute top-1/2 right-4 -translate-y-1/2" />
                                                        )}
                                                        {hasError && (
                                                            <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                                        )}

                                                        <button
                                                            type="button"

                                                            className="absolute top-5 right-3 -translate-y-1/2 transform text-black"
                                                        ></button>
                                                        {error?.message ? (
                                                            <div className="mt-3">
                                                                <span className="text-label-s text-helper-red font-semibold">
                                                                    {
                                                                        error.message
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col justify-center gap-6">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`text-label-m flex h-10.25 items-center justify-center rounded-[999px] font-extrabold ${
                                    isValid
                                        ? 'bg-helper-red cursor-pointer text-white'
                                        : 'bg-dark-grey text-light-grey-muted'
                                }`}
                            >
                                Sign up
                            </button>

                            <div className="flex items-center justify-center gap-1.25">
                                <p className="text-light-grey-muted text-body-m">
                                    Already have an account?
                                </p>

                                <Link to={`/login`}>
                                    <button>
                                        <span className="text-label-m text-helper-red font-extrabold">
                                            Log In
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
