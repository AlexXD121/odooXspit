import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Allow access to all pages by default (public dashboard)
            // Only redirect if logged in and trying to access login/register
            if (isLoggedIn) {
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
                    return Response.redirect(new URL('/', nextUrl));
                }
            }

            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
