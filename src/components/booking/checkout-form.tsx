import CheckMark from '@/assets/check-mark';
import ExclamationMark from '@/assets/exclamation-mark';
import { useEffect, useState } from 'react';

const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const expiryAllowed = (value: string) => {
    if (!/^\d{0,2}(\/\d{0,2})?$/.test(value)) return false;
    const [monthText] = value.split('/');

    if (monthText.length === 1 && monthText !== '0' && monthText !== '1') {
        return false;
    }

    if (monthText.length === 2) {
        const month = Number(monthText);
        if (month < 1 || month > 12) return false;
    }

    return true;
};

type CheckoutFormProps = {
    step: 'seats' | 'checkout';
    onStepChange: (step: 'seats' | 'checkout') => void;
    fullName: string;
    email: string;
    mobileNumber: string;
    onValidChange: (valid: boolean) => void;
    serverErrors: Record<string, string>;
    onDraftChange: (draft: CheckoutDraft | null) => void;
};
export type CheckoutDraft = {
    fullName: string;
    email: string;
    mobileNumber: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
};
const formatCard = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};
const CheckoutForm = ({
    step,
    onStepChange,
    fullName: initialName,
    email: initialEmail,
    mobileNumber: initialMobile,
    onValidChange,
    serverErrors,
    onDraftChange,
}: CheckoutFormProps) => {
    const [fullName, setFullName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [mobile, setMobile] = useState(initialMobile);
    const [card, setCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const nameError = fullName.trim() ? null : 'Full name is required';
    const emailError = !email.trim()
        ? 'Email is required'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
          ? null
          : 'Enter a valid email';
    const mobileDigits = mobile.replace(/\s+/g, '');
    const mobileError = !mobileDigits
        ? 'Mobile number is required'
        : !mobileDigits.startsWith('5')
          ? 'Georgian mobile numbers must start with 5'
          : mobileDigits.length !== 9
            ? 'Mobile number must be 9 digits'
            : null;
    const cardDigits = card.replace(/\D/g, '');
    const cardError = !cardDigits
        ? 'Card number is required'
        : cardDigits.length !== 16
          ? 'Card number must be 16 digits'
          : null;
    const expiryError = !expiry
        ? 'Expiry is required'
        : /^\d{2}\/\d{2}$/.test(expiry)
          ? null
          : 'Invalid expiry';
    const cvvError = !cvv
        ? 'CVV is required'
        : cvv.length !== 3
          ? 'CVV must be 3 digits'
          : null;

    const canPay =
        !nameError &&
        !emailError &&
        !mobileError &&
        !cardError &&
        !expiryError &&
        !cvvError;

    useEffect(() => {
        onValidChange(canPay);
        onDraftChange(
            canPay
                ? {
                      fullName: fullName.trim(),
                      email: email.trim(),
                      mobileNumber: mobile.trim(),
                      cardNumber: card,
                      expiry,
                      cvv,
                  }
                : null,
        );
    }, [
        canPay,
        fullName,
        email,
        mobile,
        card,
        expiry,
        cvv,
        onValidChange,
        onDraftChange,
    ]);

    return (
        <div className="flex w-180 shrink-0 flex-col">
            <div className="bg-background-tertiary flex w-full gap-2 rounded-full">
                {(['seats', 'checkout'] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onStepChange(item)}
                        className={`text-label-s w-full rounded-full px-4 py-2 font-semibold text-white ${
                            step === item ? 'bg-helper-red' : ''
                        }`}
                    >
                        {item === 'seats' ? 'SEATS' : 'CHECKOUT'}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <Field
                    label="Full name"
                    value={fullName}
                    error={
                        serverErrors.fullName ??
                        (touched.fullName ? nameError : null)
                    }
                    valid={!nameError}
                    onChange={setFullName}
                    onBlur={() =>
                        setTouched((current) => ({
                            ...current,
                            fullName: true,
                        }))
                    }
                />
                <div className="flex justify-between gap-3">
                    <Field
                        label="Email"
                        value={email}
                        error={touched.email ? emailError : null}
                        valid={!emailError}
                        onChange={setEmail}
                        onBlur={() =>
                            setTouched((current) => ({
                                ...current,
                                email: true,
                            }))
                        }
                    />
                    <Field
                        label="Mobile number"
                        value={mobile}
                        error={touched.mobile ? mobileError : null}
                        valid={!mobileError}
                        onChange={setMobile}
                        onBlur={() =>
                            setTouched((current) => ({
                                ...current,
                                mobile: true,
                            }))
                        }
                    />
                </div>
            </div>

            <div className="bg-background-secondary my-6 h-px w-full" />

            <div className="flex flex-col gap-4">
                <Field
                    label="Card number"
                    placeholder="1234 5678 9011 1234"

                    value={card}
                    error={touched.card ? cardError : null}
                    valid={!cardError}
                    inputMode="numeric"
                    onChange={(value) => setCard(formatCard(value))}

                    onBlur={() =>
                        setTouched((current) => ({ ...current, card: true }))
                    }
                />
                <div className="flex justify-between gap-3">
                    <Field
                        label="Expiry"
                        value={expiry}
                        error={
                            serverErrors.expiry ??
                            (touched.expiry ? expiryError : null)
                        }
                        valid={!expiryError && !serverErrors.expiry}
                        inputMode="numeric"
                        onChange={(value) => {
                            const next = formatExpiry(value);
                            if (expiryAllowed(next)) setExpiry(next);
                        }}
                        placeholder="01/12"

                        onBlur={() =>
                            setTouched((current) => ({
                                ...current,
                                expiry: true,
                            }))
                        }
                    />
                    <Field
                        label="CVV"
                        placeholder="123"

                        value={cvv}
                        error={touched.cvv ? cvvError : null}
                        valid={!cvvError}
                        inputMode="numeric"
                        onChange={(value) =>
                            setCvv(value.replace(/\D/g, '').slice(0, 3))
                        }
                        onBlur={() =>
                            setTouched((current) => ({ ...current, cvv: true }))
                        }
                    />
                </div>
            </div>
        </div>
    );
};

const Field = ({
    label,
    value,
    error,
    valid,
    onChange,
    onBlur,
    inputMode,
    placeholder,
}: {
    label: string;
    value: string;
    error: string | null;
    valid: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
    inputMode?: 'numeric' | 'text';
    placeholder?: string;
}) => (
    <div className="flex w-full flex-col gap-3">
        <label
            className={`text-label-s font-semibold ${
                error ? 'text-helper-red' : 'text-white'
            }`}
        >
            {label}
        </label>
        <div className="relative">
            <input
                value={value}
                inputMode={inputMode}
                placeholder={placeholder ?? 'Text'}
                onChange={(event) => onChange(event.target.value)}
                onBlur={onBlur}
                className={`text-label-m placeholder:text-label-m placeholder:font-regular bg-background-secondary placeholder:text-light-grey-muted w-full rounded-xl px-4 py-3 pr-10 font-semibold text-white outline-none ${
                    error
                        ? 'border-helper-red border'
                        : 'border border-transparent'
                }`}
            />
            {valid && (
                <CheckMark className="text-helper-green absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            )}
            {error && (
                <ExclamationMark className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            )}
        </div>
        {error && (
            <span className="text-helper-red text-label-s font-semibold">
                {error}
            </span>
        )}
    </div>
);

export default CheckoutForm;
