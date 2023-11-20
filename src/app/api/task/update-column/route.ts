import prisma from '@prisma/prisma';
import {
	TColumn,
	UpdateTaskOrderPayload,
} from '@/app/(app)/space/[id]/board/_utils/context/BoardContext';
import { isOnSpace } from '@auth/index';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
	const {
		spaceId,
		taskId,
		destination: d,
		source: s,
	}: UpdateTaskOrderPayload & { spaceId: string } = await req.json();

	const sourceColumnId = s.columnId;
	const destinationColumnId = d.columnId;
	const destinationIndex = d.taskIndex;

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

	try {
		const result = await prisma.$transaction(async (db) => {
			// Retrieve the task to be moved
			const taskToMove = await db.task.findUnique({
				where: { id: taskId },
			});

			if (!taskToMove) {
				throw new Error('Task not found');
			}

			// Check if the task is in the source column
			if (taskToMove.columnId !== sourceColumnId) {
				throw new Error('Task is not in the specified source column');
			}

			// Decrement indices of tasks in the source column that are after the moved task
			await db.task.updateMany({
				where: {
					columnId: sourceColumnId,
					index: {
						gt: taskToMove.index,
					},
				},
				data: {
					index: {
						decrement: 1,
					},
				},
			});

			// Increment indices of tasks in the destination column that are on or after the destination index
			await db.task.updateMany({
				where: {
					columnId: destinationColumnId,
					index: {
						gte: destinationIndex,
					},
				},
				data: {
					index: {
						increment: 1,
					},
				},
			});

			// Update the task with the new column and index
			await db.task.update({
				where: { id: taskId },
				data: {
					columnId: destinationColumnId,
					index: destinationIndex,
				},
			});
		});

		return Response.json({ result });
	} catch (e) {
		console.log(e);
		return Response.json(
			{ message: 'BAD_REQUEST' },
			{ status: 400, statusText: 'Bad Request' },
		);
	}
}
