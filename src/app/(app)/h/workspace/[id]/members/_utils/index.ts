import prisma from '@prisma/prisma';
import { cache } from 'react';

export const revalidate = 0; // seconds

export const getMembers = cache(async (id: string) => {
	const workSpace = await prisma.workSpace.findUnique({
		where: {
			id,
		},
		include: {
			UserOnWorkSpace: {
				where: {
					inviteStatus: 'accepted',
				},
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
	return workSpace;
});

export const getInvited = cache(async (id: string) => {
	const workSpace = await prisma.workSpace.findUnique({
		where: {
			id,
		},
		include: {
			UserOnWorkSpace: {
				where: {
					OR: [
						{
							inviteStatus: 'pending',
						},
						{
							inviteStatus: 'declined',
						},
					],
				},
			},
		},
	});
	return workSpace;
});
