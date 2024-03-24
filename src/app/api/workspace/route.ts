import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { isAdmin } from '@auth/index';

export async function DELETE(req: Request) {
	const { id: workspaceId } = await req.json();

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
	const result = await prisma.$transaction(async (db) => {
		const response = await Promise.all([
			db.workSpace.delete({
				where: {
					id: workspaceId,
				},
			}),
			db.userOnWorkSpace.deleteMany({
				where: {
					workSpaceId: workspaceId,
				},
			}),
			db.space.deleteMany({
				where: {
					workSpaceId: workspaceId,
				},
			}),
		]);
		return response;
	});

	await prisma.$disconnect();

	return Response.json(
		{
			message: 'DELETED_USER',
		},
		{ status: 200, statusText: 'OK' },
	);
}
