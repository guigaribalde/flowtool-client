import { currentUser } from '@auth/index';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import prisma from '@prisma/prisma';
import { ObjectId } from 'bson';
import { NextRequest } from 'next/server';

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

const createUserOnWorkspace = async (
	workSpaceId: string,
	userId: string,
	invite: string | null,
) => {
	if (invite) {
		const userOnWorkspace = await prisma.userOnWorkSpace.update({
			where: {
				id: invite,
			},
			data: {
				inviteStatus: 'accepted',
			},
		});

		return userOnWorkspace;
	}
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

export async function GET(req: NextRequest) {
	const invite = req.nextUrl.searchParams.get('invite') || null;
	const clerkCurrentUser = await getClerkCurrentUser();

	if (!clerkCurrentUser)
		return Response.json({}, { status: 401, statusText: 'Unauthorized' });

	const userDB = await currentUser();

	if (userDB) {
		await prisma.$disconnect();
		return Response.json(
			{},
			{ status: 400, statusText: 'User already exists' },
		);
	}

	const userId = new ObjectId().toString();

	try {
		const workSpace = await createWorkspace();
		const userOnWorkspace = await createUserOnWorkspace(
			workSpace.id,
			userId,
			invite,
		);

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

		await prisma.$disconnect();

		return Response.json({ user });
	} catch (e) {
		return Response.json(
			{},
			{ status: 500, statusText: 'Unable to udpate or create' },
		);
	}
}
