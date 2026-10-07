import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import ExclamationMark from '@/assets/exclamation-mark';
import CalendarIcon from '@/assets/calendar-icon';
import DropDownArrow from '@/assets/drop-down-arrow';
import { useMe, useVenues } from '@/react-query/query';
import { useUpdateProfile } from '@/react-query/mutation';
import {
    ProfileFormSchema,
    type ProfileFormValues,
} from '@/pages/profile-page/components/schema';
import type { BackendErrorResponse } from '@/pages/profile-page/components/index.types';

const fieldClass = (hasError: boolean, disabled = false) =>
    `input-default outline-none ${
        hasError
            ? 'border-helper-red text-helper-red border placeholder:text-helper-red'
            : 'placeholder:text-light-grey-muted'
    } ${
        disabled
            ? 'text-light-grey-muted'
            : hasError
              ? 'text-helper-red'
              : 'text-white'
    }`;

const PersonalInformation = () => {
    const { data: me, isLoading: isMeLoading, isFetching } = useMe();
    const { data: venues } = useVenues();
    const queryClient = useQueryClient();
    const dateInputRef = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, reset, setError, trigger } =
        useForm<ProfileFormValues>({
            resolver: zodResolver(ProfileFormSchema),
            mode: 'onBlur',
            defaultValues: {
                fullName: '',
                email: '',
                mobileNumber: '',
                dateOfBirth: '',
                preferredVenueId: '',
            },
        });

    useEffect(() => {
        if (!me) return;

        reset({
            fullName: me.fullName ?? '',
            email: me.email ?? '',
            mobileNumber: me.mobileNumber ?? '',
            dateOfBirth: me.dateOfBirth ?? '',
            preferredVenueId:
                me.preferredVenue?.id != null
                    ? String(me.preferredVenue.id)
                    : '',
        });
    }, [me, reset]);

    const { mutate: saveProfile, isPending } = useUpdateProfile({
        onSuccess: async (data) => {
            queryClient.setQueryData(['me'], data);
            await queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: (error: AxiosError) => {
            const data = error.response?.data as
                BackendErrorResponse | undefined;
            if (!data?.errors) return;

            Object.entries(data.errors).forEach(([field, messages]) => {
                setError(field as keyof ProfileFormValues, {
                    type: 'server',
                    message: messages[0],
                });
            });
        },
    });

    const onSubmit = (values: ProfileFormValues) => {
        console.log('changes saved', values);
        saveProfile({
            fullName: values.fullName,
            mobileNumber: values.mobileNumber,
            dateOfBirth: values.dateOfBirth,
            preferredVenueId: values.preferredVenueId
                ? Number(values.preferredVenueId)
                : null,
        });
    };

    const renderField = ({
        name,
        label,
        placeholder,
        disabled = false,
        hint,
        type = 'text',
        rightIcon,
        transform,
        inputMode,
    }: {
        name: keyof ProfileFormValues;
        label: string;
        placeholder: string;
        disabled?: boolean;
        hint?: string;
        type?: string;
        rightIcon?: ReactNode;
        transform?: (value: string) => string;
        inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    }) => (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
            }) => {
                const hasError = !!error;
                return (
                    <div className="flex flex-col gap-2">
                        <label
                            className={`text-body-s font-semibold ${
                                hasError ? 'text-helper-red' : 'text-white'
                            }`}
                        >
                            {label}
                        </label>
                        <div className="relative">
                            <input
                                type={type}
                                value={value}
                                disabled={disabled}
                                placeholder={placeholder}
                                inputMode={inputMode}
                                onChange={(e) => {
                                    const next = transform
                                        ? transform(e.target.value)
                                        : e.target.value;
                                    onChange(next);
                                }}
                                onBlur={() => {
                                    onBlur();
                                    if (!disabled) trigger(name);
                                }}
                                className={`${fieldClass(hasError, disabled)} ${
                                    rightIcon && hasError
                                        ? 'pr-16'
                                        : rightIcon || hasError
                                          ? 'pr-12'
                                          : ''
                                }`}
                            />

                            {rightIcon && (
                                <span
                                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                                        hasError ? 'right-10' : 'right-4'
                                    }`}
                                >
                                    {rightIcon}
                                </span>
                            )}

                            {hasError && (
                                <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                            )}
                        </div>
                        {hint && !error && (
                            <p className="text-label-s text-light-grey-muted font-semibold">
                                {hint}
                            </p>
                        )}
                        {error?.message && (
                            <span className="text-label-s text-helper-red font-semibold">
                                {error.message}
                            </span>
                        )}
                    </div>
                );
            }}
        />
    );

    if (isMeLoading || !me) {
        return (
            <p className="text-light-grey-muted text-body-s">
                Loading profile...
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {renderField({
                name: 'fullName',
                label: 'Full name',
                placeholder: 'Full name',
            })}

            {renderField({
                name: 'email',
                label: 'Email',
                placeholder: 'Email',
                disabled: true,
                hint: 'Set at registration and cannot be changed',
            })}

            {renderField({
                name: 'mobileNumber',
                label: 'Mobile number',
                placeholder: '555 123 456',
                inputMode: 'numeric',
                transform: (value) => value.replace(/[^\d\s]/g, ''),
            })}

            <Controller
                name="dateOfBirth"
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => {
                    const hasError = !!error;

                    const openDatePicker = () => {
                        const el = dateInputRef.current;
                        if (!el) return;
                        try {
                            if (typeof el.showPicker === 'function') {
                                el.showPicker();
                            } else {
                                el.click();
                            }
                        } catch {
                            el.click();
                        }
                    };

                    return (
                        <div className="flex flex-col gap-2">
                            <label
                                className={`text-body-s font-semibold ${
                                    hasError ? 'text-helper-red' : 'text-white'
                                }`}
                            >
                                Date of birth
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={value}
                                    placeholder="Date of Birth"
                                    onClick={openDatePicker}
                                    onBlur={() => {
                                        onBlur();
                                        trigger('dateOfBirth');
                                    }}
                                    className={`${fieldClass(hasError)} cursor-pointer ${
                                        hasError ? 'pr-16' : 'pr-12'
                                    }`}
                                />

                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    value={value}
                                    onChange={(e) => {
                                        onChange(e.target.value);
                                        void trigger('dateOfBirth');
                                    }}
                                    onBlur={() => {
                                        onBlur();
                                        trigger('dateOfBirth');
                                    }}
                                    tabIndex={-1}
                                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                                />

                                <button
                                    type="button"
                                    onClick={openDatePicker}
                                    className={`absolute top-1/2 -translate-y-1/2 ${
                                        hasError ? 'right-10' : 'right-4'
                                    }`}
                                >
                                    <CalendarIcon />
                                </button>

                                {hasError && (
                                    <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                )}
                            </div>
                            {error?.message && (
                                <span className="text-label-s text-helper-red font-semibold">
                                    {error.message}
                                </span>
                            )}
                        </div>
                    );
                }}
            />

            <Controller
                name="preferredVenueId"
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => {
                    const hasError = !!error;
                    return (
                        <div className="flex flex-col gap-2">
                            <label
                                className={`text-body-s font-semibold ${
                                    hasError ? 'text-helper-red' : 'text-white'
                                }`}
                            >
                                Preferred Venue (Optional)
                            </label>

                            <div className="relative">
                                <select
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={() => {
                                        onBlur();
                                        trigger('preferredVenueId');
                                    }}
                                    className={`${fieldClass(hasError)} appearance-none ${
                                        !value ? 'text-light-grey-muted' : ''
                                    } ${
                                        hasError
                                            ? 'text-helper-red pr-16'
                                            : 'pr-12'
                                    }`}
                                >
                                    <option value="">Choose a Venue</option>
                                    {venues?.map((venue) => (
                                        <option
                                            key={venue.id}
                                            value={String(venue.id)}
                                            className="bg-background-secondary text-white"
                                        >
                                            {venue.name}
                                        </option>
                                    ))}
                                </select>

                                <span
                                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                                        hasError ? 'right-10' : 'right-4'
                                    }`}
                                >
                                    <DropDownArrow />
                                </span>

                                {hasError && (
                                    <ExclamationMark className="absolute top-1/2 right-4 -translate-y-1/2" />
                                )}
                            </div>

                            {error?.message && (
                                <span className="text-label-s text-helper-red font-semibold">
                                    {error.message}
                                </span>
                            )}
                        </div>
                    );
                }}
            />

            <button
                type="submit"
                disabled={isPending || isFetching}
                className="bg-helper-red text-label-m mt-4 w-35.75 cursor-pointer rounded-[999px] px-5.5 py-3.25 font-semibold text-white"
            >
                Save changes
            </button>
        </form>
    );
};

export default PersonalInformation;
