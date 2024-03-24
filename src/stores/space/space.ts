import { create } from 'zustand';
import { type Socket } from 'socket.io-client';
import {
	Prisma,
	Board as TBoard,
	Column as TColumn,
	Task as TTask,
} from '@prisma/client';
import { type TaskSlice, createTaskSlice } from './task-slice';
import { type ColumnSlice, createColumnSlice } from './column-slice';
import { type BoardSlice, createBoardSlice } from './board-slice';
import { type SpaceSlice, createSpaceSliece } from './space-slice';

export type InitialData = Prisma.SpaceGetPayload<{
	include: {
		boards: {
			include: {
				columns: {
					include: {
						tasks: {
							orderBy: {
								index: 'asc';
							};
						};
					};
					orderBy: {
						index: 'asc';
					};
				};
			};
		};
	};
}>;

type Space = SpaceSlice &
	BoardSlice &
	TaskSlice &
	ColumnSlice & {
		socket: Socket;
		build: (initialData: InitialData, socket: Socket) => void;
	};
export const useSpace = create<Space>()((...args) => {
	return {
		socket: {} as Socket,
		...createSpaceSliece(...args),
		...createBoardSlice(...args),
		...createColumnSlice(...args),
		...createTaskSlice(...args),
		build: (initialData: InitialData, socket: Socket) => {
			const [set] = args;
			const { boards: boardsData, ...space } = initialData;

			set(() => {
				const columns: Record<string, TColumn> = {};
				const tasks: Record<string, TTask> = {};
				const boards: Record<string, TBoard> = {};

				boardsData.forEach((board) => {
					const { columns: columnsData, ...boardData } = board;
					boards[board.id] = boardData;

					columnsData.forEach((column) => {
						const { tasks: tasksData, ...columnData } = column;
						columns[column.id] = columnData;

						tasksData.forEach((task) => {
							tasks[task.id] = task;
						});
					});
				});

				return {
					socket,
					space,
					boards,
					columns,
					tasks,
				};
			});
		},
	};
});
