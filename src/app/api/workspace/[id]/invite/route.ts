import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { Resend } from 'resend';
import { isAdmin } from '@auth/index';

const resend = new Resend(process.env.RESEND_API_KEY);

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

	const data = await prisma.userOnWorkSpace.create({
		data: {
			workSpaceId: id,
			invitedUserEmail: email,
			inviteStatus: 'pending',
			userRole: 'member',
		},
	});

	return data;
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

	const adm = await isAdmin(workspaceId);
	if (!adm) {
		await prisma.$disconnect();
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);
	}

	const invitedUser = await inviteUser(workspaceId, email);
	const workspace = await prisma.workSpace.findUnique({
		where: {
			id: workspaceId,
		},
	});
	await prisma.$disconnect();

	if (!invitedUser)
		return Response.json(
			{
				message: 'ALREADY_INVITED_USER',
			},
			{ status: 400, statusText: 'Bad Request' },
		);

	const link = `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?invite=${invitedUser.id}`;

	try {
		const data = await resend.emails.send({
			from: 'inPlanning <no-reply@guiga.dev>',
			to: [email],
			subject: 'Você foi convidado para uma organização no inPlanning',
			html: `
				<h1>Você recebeu um convite!</h1>
				<h3>Você foi convidado para a organização ${workspace?.name}.</h3>
				<p>Para aceitar o convite, <a href="${link}">clique aqui</a></p>
			`,
		});
		return Response.json(
			{
				data,
				invitedUser,
			},
			{ status: 200, statusText: 'OK' },
		);
	} catch (error) {
		return Response.json(
			{
				message: 'ALREADY_INVITED_USER',
			},
			{ status: 400, statusText: 'Bad Request' },
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const { userId } = await req.json();
	const { id: workspaceId } = params;

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

	await prisma.userOnWorkSpace.deleteMany({
		where: {
			workSpaceId: workspaceId,
			id: userId,
			OR: [
				{
					inviteStatus: 'pending',
				},
				{
					inviteStatus: 'declined',
				},
			],
		},
	});

	await prisma.$disconnect();

	return Response.json(
		{
			message: 'DELETED_USER',
		},
		{ status: 200, statusText: 'OK' },
	);
}
