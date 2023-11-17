import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	publicRoutes: ['/'],
	afterAuth(auth, req) {
		const { userId, isPublicRoute } = auth;
		if (userId && isPublicRoute) {
			const url = new URL('/h/spaces', req.url);
			return NextResponse.redirect(url);
		}
		return null;
	},
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
