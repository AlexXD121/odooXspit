'use client';

import { useActionState, useState, useTransition } from 'react';
import { authenticate, preAuthenticate } from '@/app/lib/actions/auth-actions';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handlePreAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            try {
                const result = await preAuthenticate(formData);

                if (result?.error) {
                    setErrorMessage(result.error);
                } else {
                    setStep('otp');
                }
            } catch (error) {
                setErrorMessage('An unexpected error occurred.');
            }
        });
    };

    const [authErrorMessage, dispatchAuth] = useActionState(authenticate, undefined);

    return (
        <div className="space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                <p className="text-slate-500 mt-2">
                    {step === 'credentials'
                        ? 'Please enter your details to sign in.'
                        : 'We sent a code to your email. Enter it below.'}
                </p>
            </div>

            {step === 'credentials' ? (
                <form onSubmit={handlePreAuth} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        Continue
                    </button>
                </form>
            ) : (
                <form action={dispatchAuth} className="space-y-6">
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="password" value={password} />

                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1.5">One-Time Password</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="000000"
                            required
                            maxLength={6}
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <p className="text-xs text-center text-slate-400 mt-2">
                            Code expires in 5 minutes
                        </p>
                    </div>

                    {authErrorMessage && (
                        <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{authErrorMessage}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('credentials')}
                            className="w-full flex justify-center py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Back to Login
                        </button>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{' '}
                            <a href="/register" className="text-blue-600 font-semibold hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
}
