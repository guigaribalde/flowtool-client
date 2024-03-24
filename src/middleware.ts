import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

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
