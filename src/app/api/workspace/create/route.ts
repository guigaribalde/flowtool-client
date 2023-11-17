import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';

const createWorkspace = async (name: string, clerkId: string) => {
	const workspace = await prisma.workSpace.create({
		data: {
			name,
			UserOnWorkSpace: {
				create: {
					user: {
						connect: {
							clerkId,
						},
					},
					userRole: 'owner',
					inviteStatus: 'accepted',
				},
			},
		},
	});

	return workspace;
};

export async function POST(req: Request) {
	const { name } = await req.json();

	const clerkCurrentUser = await getClerkCurrentUser();

	if (!clerkCurrentUser)
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);

	const workspace = await createWorkspace(name, clerkCurrentUser.id);
	await prisma.$disconnect();

	if (!workspace)
		return Response.json(
			{
				message: 'SOMETHING_WENT_WRONG',
			},
			{ status: 400, statusText: 'Bad Request' },
		);

	return Response.json(
		{
			workspace,
		},
		{ status: 200, statusText: 'OK' },
	);
}
