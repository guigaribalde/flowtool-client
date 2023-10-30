/* eslint-disable import/prefer-default-export */
import { currentUser as getClerkUser } from '@clerk/nextjs';
import {
	createUserIfNotExists,
	getUser,
} from '@prisma/controller/user.controller';

export async function GET() {
	const currentUser = await getClerkUser();
	if (currentUser) {
		const user = await createUserIfNotExists({
			email: currentUser.emailAddresses[0].emailAddress,
			clerkId: currentUser.id,
			companyId: null,
			socketId: null,
			status: 'online',
			username: currentUser?.username || 'Anoniomo',
		});
		if (!user) {
			try {
				const existingUser = await getUser(currentUser.id);
				return Response.json({ user: existingUser });
			} catch (error) {
				return Response.json({ user: null });
			}
		}
		return Response.json({ user });
	}
	return Response.json({ user: null });
}
