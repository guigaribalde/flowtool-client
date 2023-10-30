import { type Prisma, type InvitedUser } from '@prisma/client';
import prisma from '../prisma';

const createInvitedUser = async (
	invitedUser: Omit<InvitedUser, 'id'>,
): Promise<InvitedUser | undefined> => {
	try {
		const newInvitedUser = await prisma.invitedUser.create({
			data: invitedUser,
		});
		await prisma.$disconnect();
		return newInvitedUser;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

type CreateManyData =
	| Prisma.InvitedUserCreateManyInput
	| Prisma.InvitedUserCreateManyInput[];
const createManyInvitedUser = async (
	invitedUsers: CreateManyData,
): Promise<Prisma.BatchPayload | undefined> => {
	try {
		const newInvitedUsers = await prisma.invitedUser.createMany({
			data: invitedUsers,
		});
		await prisma.$disconnect();
		return newInvitedUsers;
	} catch (error) {
		console.log('error', error);
		return undefined;
	}
};

const getInvitedUsers = async (
	invitedUsers: Omit<InvitedUser, 'id'>[],
): Promise<InvitedUser[] | undefined> => {
	try {
		const existingInvitedUsers = await prisma.invitedUser.findMany({
			where: {
				email: {
					in: invitedUsers.map((user) => user.email),
				},
			},
		});
		await prisma.$disconnect();
		return existingInvitedUsers;
	} catch (error) {
		console.log('error', error);
		return undefined;
	}
};

export { createInvitedUser, createManyInvitedUser, getInvitedUsers };
