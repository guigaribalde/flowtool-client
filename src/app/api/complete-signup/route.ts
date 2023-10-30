/* eslint-disable import/prefer-default-export */
import { currentUser as getClerkUser } from '@clerk/nextjs';
import { getUser, updateUser } from '@prisma/controller/user.controller';
import { createCompany } from '@prisma/controller/company.controller';
import {
	createManyInvitedUser,
	getInvitedUsers,
} from '@prisma/controller/inviteduser.controller';

interface Data {
	spaceName: string;
	guests: string[];
}

export async function POST(req: Request) {
	const clerkCurrentUser = await getClerkUser();
	const { guests, spaceName }: Data = await req.json();

	if (!clerkCurrentUser)
		return Response.json({}, { status: 401, statusText: 'User not found' });

	const currentUser = await getUser(clerkCurrentUser.id);

	let company: any = { id: currentUser?.companyId };

	if (!company.id) {
		company = await createCompany({
			name: spaceName,
		});
		if (!company)
			return Response.json(
				{},
				{ status: 500, statusText: 'Company not created' },
			);
	}

	if (!guests.length)
		return Response.json({}, { status: 200, statusText: 'Space Created' });

	try {
		const user = await updateUser(clerkCurrentUser.id, {
			company: {
				connect: {
					id: company.id,
				},
			},
		});

		try {
			const alreadyInvitedUsers = await getInvitedUsers(
				guests.map((guest) => ({
					email: guest,
					companyId: company.id,
				})),
			);
			if (!alreadyInvitedUsers)
				return Response.json(
					{},
					{ status: 500, statusText: 'Users not invited' },
				);
			if (alreadyInvitedUsers.length > 0) {
				const users = alreadyInvitedUsers.map((u) => u.email);
				return Response.json(
					{
						users,
					},
					{
						status: 400,
						statusText: 'There are users that where already invited',
					},
				);
			}
			const invitedUsers = await createManyInvitedUser(
				guests.map((guest) => ({
					email: guest,
					companyId: company.id,
				})),
			);

			if (!invitedUsers)
				return Response.json(
					{},
					{ status: 500, statusText: 'Users not invited' },
				);

			return Response.json(
				{
					users_created: invitedUsers.count,
				},
				{
					status: 200,
					statusText: 'Users invited',
				},
			);
		} catch (e) {
			return Response.json(
				{},
				{ status: 500, statusText: 'Users not invited' },
			);
		}

		if (!user)
			return Response.json({}, { status: 500, statusText: 'User not updated' });
		return Response.json(user);
	} catch (e) {
		return Response.json({}, { status: 500, statusText: 'User not updated' });
	}
}
