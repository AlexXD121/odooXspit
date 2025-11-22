'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for the initial password check
const PreAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function preAuthenticate(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Pre-auth input:', { email, password });

    const validatedFields = PreAuthSchema.safeParse({ email, password });

    if (!validatedFields.success) {
        return { error: 'Invalid email or password format.' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: 'Invalid credentials.' };

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return { error: 'Invalid credentials.' };

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to DB
        await prisma.user.update({
            where: { email },
            // @ts-ignore
            data: { otp, otpExpires },
        });

        console.log(`🔐 OTP for ${email}: ${otp}`); // In real app, send via email/SMS

        return { success: true, message: 'OTP sent to your email.' };
    } catch (error) {
        console.error('Pre-auth error:', error);
        return { error: 'Something went wrong.' };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid OTP or credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export interface RegisterState {
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string[];
    };
    success?: boolean;
    message?: string;
}

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const validatedFields = RegisterSchema.safeParse({ name, email, password, confirmPassword });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: { email: ['Email already in use.'] } };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            },
        });

        return { success: true, message: 'Account created successfully. Please log in.' };
    } catch (error) {
        console.error('Registration error:', error);
        return { error: { form: ['Something went wrong. Please try again.'] } };
    }
}

export async function signOutAction() {
    await signOut();
}
