'use client';

import { useActionState } from 'react';
import { registerUser, RegisterState } from '@/app/lib/actions/auth-actions';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const initialState: RegisterState = {
    error: {},
    success: false,
    message: ''
};

export default function RegisterForm() {
    const [state, dispatch] = useActionState(registerUser, initialState);

    return (
        <div className="space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
                <p className="text-slate-500 mt-2">
                    Start managing your inventory smarter today.
                </p>
            </div>

            {state?.success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-green-900">Account Created!</h3>
                        <p className="text-green-700 mt-1">{state.message}</p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all"
                    >
                        Go to Login
                    </Link>
                </div>
            ) : (
                <form action={dispatch} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {state?.error?.name && (
                                <p className="text-sm text-rose-600 mt-1">{state.error.name[0]}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {state?.error?.email && (
                                <p className="text-sm text-rose-600 mt-1">{state.error.email[0]}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {state?.error?.password && (
                                <p className="text-sm text-rose-600 mt-1">{state.error.password[0]}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {state?.error?.confirmPassword && (
                                <p className="text-sm text-rose-600 mt-1">{state.error.confirmPassword[0]}</p>
                            )}
                        </div>
                    </div>

                    {state?.error?.form && (
                        <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{state.error.form[0]}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                    >
                        Create Account
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
}
