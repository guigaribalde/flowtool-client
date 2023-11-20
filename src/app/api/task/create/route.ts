import prisma from '@prisma/prisma';
import { auth } from '@clerk/nextjs';
import { isOnSpace, isOnWorkSpace } from '@auth/index';
import { ObjectId } from 'bson';

const createTask = async ({
	columnId,
	id,
	index,
	name,
}: {
	index: number;
	name: string;
	id: string;
	columnId: string;
}) => {
	const task = await prisma.task.create({
		data: {
			id,
			name,
			index,
			Column: {
				connect: {
					id: columnId,
				},
			},
		},
	});

	return task;
};

export async function POST(req: Request) {
	const { spaceId, columnId, id, index, name } = await req.json();
	const { userId } = auth();

	if (!userId)
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);

	const isOS = await isOnSpace(spaceId);

	if (!isOS) {
		await prisma.$disconnect();
		return Response.json(
			{ message: 'UNAUTHORIZED' },
			{ status: 401, statusText: 'Unauthorized' },
		);
	}

	const column = await prisma.column.findFirst({
		where: {
			id: columnId,
		},
	});

	if (!column) {
		await prisma.$disconnect();
		return Response.json(
			{ message: 'BAD_REQUEST' },
			{ status: 400, statusText: 'Bad Request' },
		);
	}

	const task = await createTask({ columnId, id, index, name });
	await prisma.$disconnect();

	if (!task)
		return Response.json(
			{
				message: 'SOMETHING_WENT_WRONG',
			},
			{ status: 400, statusText: 'Bad Request' },
		);

	return Response.json(
		{
			task,
		},
		{ status: 200, statusText: 'OK' },
	);
}
