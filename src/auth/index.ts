import { auth } from '@clerk/nextjs';
import prisma from '@prisma/prisma';

const isAdmin = async (workSpaceId: string) => {
	const { userId } = auth();

	if (!userId) return false;

	const user = await prisma.userOnWorkSpace.findFirst({
		where: {
			workSpaceId,
			user: {
				clerkId: userId,
			},
			OR: [
				{
					userRole: 'owner',
				},
				{
					userRole: 'admin',
				},
			],
		},
	});

	return !!user;
};

const isOnWorkSpace = async (workSpaceId: string) => {
	const { userId } = auth();

	if (!userId) return false;

	const user = await prisma.userOnWorkSpace.findFirst({
		where: {
			workSpaceId,
			user: {
				clerkId: userId,
			},
		},
	});

	return !!user;
};

const isOnSpace = async (spaceId: string) => {
	const { userId } = auth();

	if (!userId) return false;

	const workspace = await prisma.workSpace.findFirst({
		where: {
			Space: {
				some: {
					id: spaceId,
				},
			},
		},
		include: {
			Space: true,
			UserOnWorkSpace: {
				where: {
					user: {
						clerkId: userId,
					},
				},
				include: {
					user: true,
				},
			},
		},
	});

	if (!workspace) return false;

	if (!workspace.UserOnWorkSpace.length) return false;

	return !!workspace.UserOnWorkSpace[0].user?.id;
};

const currentUser = async () => {
	const { userId } = auth();

	if (!userId) return undefined;

	const user = await prisma.user.findUnique({
		where: {
			clerkId: userId,
		},
	});

	if (!user) return undefined;

	return user;
};

export { isOnSpace, isAdmin, isOnWorkSpace, currentUser };
