import { z } from 'zod'

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid E-mail' })
        .min(3, { message: 'email must be at least 3 characters' }),
    password: z.string().min(3, {
        message: 'password must be at least 3 characters',
    }),
})
