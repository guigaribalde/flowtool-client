import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { NextRequest } from 'next/server';
// import { userIsAdminByClerkId } from '@/utils/utils';

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { id: workspaceId } = params;
	const currentUser = await getClerkCurrentUser();

	if (!currentUser)
		return Response.json(
			{ message: 'NOT_AUTHENTICATED' },
			{ status: 401, statusText: 'Unauthorized' },
		);

	if (!workspaceId)
		return Response.json(
			{ message: 'MISSING_ID' },
			{ status: 400, statusText: 'Bad Request' },
		);

	// const isAdmin = await userIsAdminByClerkId(workspaceId, currentUser.id);
	//
	// if (!isAdmin) {
	// 	await prisma.$disconnect();
	// 	return Response.json(
	// 		{ message: 'NOT_AUTHORIZED' },
	// 		{ status: 403, statusText: 'Forbidden' },
	// 	);
	// }

	const workspace = await prisma.workSpace.findUnique({
		where: {
			id: workspaceId,
		},
		include: {
			UserOnWorkSpace: {
				include: {
					user: {
						select: {
							id: true,
							email: true,
							username: true,
							status: true,
						},
					},
				},
			},
		},
	});

	if (!workspace) {
		await prisma.$disconnect();
		return Response.json(
			{ message: 'WORKSPACE_NOT_FOUND' },
			{ status: 404, statusText: 'Not Found' },
		);
	}

	const users = workspace.UserOnWorkSpace.flatMap(
		({ user, userRole, id, inviteStatus, invitedUserEmail }) => {
			return {
				...user,
				id,
				userRole,
				inviteStatus,
				invitedUserEmail,
			};
		},
	);

	await prisma.$disconnect();
	return Response.json({ users });
}
