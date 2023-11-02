/* eslint-disable import/prefer-default-export */
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import prisma from '@prisma/prisma';

export async function GET() {
	const clerkCurrentUser = await getClerkCurrentUser();
	if (clerkCurrentUser) {
		const user: Omit<User, 'id'> = {
			clerkId: clerkCurrentUser.id,
			spaceId: null,
			socketId: null,
			email: clerkCurrentUser.emailAddresses[0].emailAddress,
			username: clerkCurrentUser?.username || 'Anonymous',
			status: 'online',
		};

		try {
			const userDb = await prisma.user.upsert({
				where: { clerkId: clerkCurrentUser.id },
				update: user,
				create: user,
			});
			console.log('userDb', userDb);
			prisma.$disconnect();
			return Response.json({ user: userDb });
		} catch (e) {
			return Response.json(
				{},
				{ status: 500, statusText: 'Unable to udpate or create user' },
			);
		}
	}
	return Response.json({}, { status: 401, statusText: 'Unauthorized' });
}
