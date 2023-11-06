import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import prisma from '@prisma/prisma';
import { ObjectId } from 'bson';

const createWorkspace = async () => {
	const workspace = await prisma.workSpace.create({
		data: {
			name: 'My Workspace',
			Space: {
				create: {
					name: 'My Space',
				},
			},
		},
	});

	return workspace;
};

const createUserOnWorkspace = async (workSpaceId: string, userId: string) => {
	const userOnWorkspace = await prisma.userOnWorkSpace.create({
		data: {
			userId,
			workSpaceId,
			inviteStatus: 'accepted',
			userRole: 'owner',
		},
	});

	return userOnWorkspace;
};

export async function GET() {
	const clerkCurrentUser = await getClerkCurrentUser();

	if (clerkCurrentUser) {
		const currentUser = await prisma.user.findUnique({
			where: {
				clerkId: clerkCurrentUser.id,
			},
		});

		if (currentUser) {
			prisma.$disconnect();
			return Response.json({}, { status: 401, statusText: 'Unauthorized' });
		}

		const userId = new ObjectId().toString();

		try {
			const workSpace = await createWorkspace();
			const userOnWorkspace = await createUserOnWorkspace(workSpace.id, userId);

			const user = await prisma.user.create({
				data: {
					id: userId,
					clerkId: clerkCurrentUser.id,
					socketId: null,
					email: clerkCurrentUser.emailAddresses[0].emailAddress,
					username: clerkCurrentUser?.username || 'Anonymous',
					status: 'online',
					UserOnWorkSpace: {
						connect: {
							id: userOnWorkspace.id,
						},
					},
				},
			});

			prisma.$disconnect();

			return Response.json({ user });
		} catch (e) {
			return Response.json(
				{},
				{ status: 500, statusText: 'Unable to udpate or create' },
			);
		}
	}
	return Response.json({}, { status: 401, statusText: 'Unauthorized' });
}
