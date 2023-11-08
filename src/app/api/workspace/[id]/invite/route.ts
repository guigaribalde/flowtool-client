import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';

const inviteUser = async (id: string, email: string) => {
	const user = await prisma.userOnWorkSpace.findMany({
		where: {
			OR: [
				{
					AND: [
						{
							workSpaceId: id,
						},
						{
							invitedUserEmail: email,
						},
					],
				},
				{
					AND: [
						{
							workSpaceId: id,
						},
						{
							user: {
								email,
							},
						},
					],
				},
			],
		},
	});

	if (user?.length > 0) return false;

	await prisma.userOnWorkSpace.create({
		data: {
			workSpaceId: id,
			invitedUserEmail: email,
			inviteStatus: 'pending',
			userRole: 'member',
		},
	});

	return true;
};

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const { email } = await req.json();
	const { id: workspaceId } = params;

	const clerkCurrentUser = await getClerkCurrentUser();

	if (!clerkCurrentUser)
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);

	const hasInvited = await inviteUser(workspaceId, email);
	prisma.$disconnect();

	if (!hasInvited)
		return Response.json(
			{
				message: 'ALREADY_INVITED_USER',
			},
			{ status: 400, statusText: 'Bad Request' },
		);

	return Response.json(
		{
			message: 'INVITED_USER',
		},
		{ status: 200, statusText: 'OK' },
	);
}
