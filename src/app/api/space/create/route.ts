import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { isAdmin } from '@auth/index';

const createSpace = async (workspaceId: string, name: string) => {
	const space = await prisma.space.create({
		data: {
			workSpaceId: workspaceId,
			name,
		},
	});
	return space;
};

export async function POST(req: Request) {
	const { workspaceId, name } = await req.json();

	const clerkCurrentUser = await getClerkCurrentUser();

	if (!clerkCurrentUser)
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);

	const adm = await isAdmin(workspaceId);
	if (!adm) {
		await prisma.$disconnect();
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);
	}

	const space = await createSpace(workspaceId, name);
	await prisma.$disconnect();

	if (!space)
		return Response.json(
			{
				message: 'SOMETHING_WENT_WRONG',
			},
			{ status: 400, statusText: 'Bad Request' },
		);

	return Response.json(
		{
			space,
		},
		{ status: 200, statusText: 'OK' },
	);
}
