import { z } from 'zod';

const isAtLeast12YearsOld = (dateStr: string) => {
    const dob = new Date(dateStr);
    if (Number.isNaN(dob.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
    }

    return age >= 12;
};

export const ProfileFormSchema = z.object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().email(),
    mobileNumber: z
        .string()
        .min(1, { message: 'Mobile number is required' })
        .superRefine((value, ctx) => {
            const digits = value.replace(/\s+/g, '');

            if (!digits.startsWith('5')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Georgian mobile numbers must start with 5',
                });
                return;
            }

            if (digits.length !== 9) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Mobile number must be 9 digits',
                });
            }
        }),
    dateOfBirth: z
        .string()
        .min(1, { message: 'Date of birth is required' })
        .refine((value) => !Number.isNaN(new Date(value).getTime()), {
            message: 'Invalid date',
        })
        .refine((value) => isAtLeast12YearsOld(value), {
            message: 'Must be at least 12 years ago',
        }),
    preferredVenueId: z.string(),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
