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

	const destination = d.taskIndex;
	const source = s.taskIndex;

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
		// Start a transaction to ensure data integrity
		const result = await prisma.$transaction(async (db) => {
			// Retrieve the task to be moved
			const taskToMove = await db.task.findUnique({
				where: { id: taskId },
			});

			if (!taskToMove) {
				throw new Error('Task not found');
			}

			// Check if the task is being moved within the same column
			if (taskToMove.index === source) {
				// Update the indices of the tasks affected by the move
				if (source < destination) {
					// Moving the task downwards
					await db.task.updateMany({
						where: {
							columnId: taskToMove.columnId,
							index: {
								gt: source,
								lte: destination,
							},
						},
						data: {
							index: {
								decrement: 1,
							},
						},
					});
				} else {
					// Moving the task upwards
					await db.task.updateMany({
						where: {
							columnId: taskToMove.columnId,
							index: {
								lt: source,
								gte: destination,
							},
						},
						data: {
							index: {
								increment: 1,
							},
						},
					});
				}

				// Update the index of the moved task
				await db.task.update({
					where: { id: taskId },
					data: { index: destination },
				});
			} else {
				throw new Error('Task is not in the specified source position');
			}
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
