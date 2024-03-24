/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import SocketContext from '@/utils/contexts/SocketContext/Context';
import { DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';

type TaskStyle = DraggingStyle | NotDraggingStyle | undefined;

export type MoveTaskPayload = {
	style: TaskStyle;
	taskId: string;
};

export type UpdateTaskOrderPayload = {
	source: {
		columnId: string;
		taskIndex: number;
	};
	destination: {
		columnId: string;
		taskIndex: number;
	};
	taskId: string;
};

export type CreateColumnPayload = {
	id: string;
	name: string;
	index: number;
	tasks: any[];
};

export type CreateTaskPayload = {
	id: string;
	name: string;
	index: number;
	columnId: string;
};

export type TBoard =
	| ({
			columns: TColumn[];
	  } & {
			id: string;
			name: string;
			spaceId: string | null;
	  })
	| undefined;

export type TColumn = {
	id: string;
	name: string;
	index: number;
	boardId: string | null;
	tasks: {
		id: string;
		name: string;
		index: number;
		columnId: string | null;
	}[];
};

export interface BoardContextState {
	board: TBoard;
	createColumn: (payload: CreateColumnPayload) => void;
	createTask: (payload: CreateTaskPayload) => void;
	moveTask: (payload: MoveTaskPayload) => void;
	updateTasksOrder: (payload: UpdateTaskOrderPayload) => void;
	updateTasksColumn: (payload: UpdateTaskOrderPayload) => void;
	moveEndTask: (payload: { taskId: string }) => void;
	clientMovingTask: string;
	taskMoveEvent: {
		taskId: string;
		style: {} | TaskStyle;
	};
}

const BoardContext = createContext<BoardContextState>({} as BoardContextState);

export default function BoardContextProvider({
	children,
	initialData,
	spaceId,
}: {
	children: React.ReactNode;
	initialData: TBoard;
	spaceId: string;
}) {
	const { SocketState } = useContext(SocketContext);

	const [board, setBoard] = useState<TBoard>(initialData);
	const [clientMovingTask, setClientMovingTask] = useState('');
	const [taskMoveEvent, setTaskMoveEvent] = useState<MoveTaskPayload>({
		taskId: '',
		style: {} as TaskStyle,
	});

	const createColumn = (payload: CreateColumnPayload) => {
		SocketState.socket?.emit('create:column', { ...payload, spaceId });
		setBoard((oldBoard) => {
			const newBoard = {
				...oldBoard,
				columns: [...(oldBoard?.columns || []), payload],
			} as TBoard;

			return newBoard;
		});
	};

	const createTask = (payload: CreateTaskPayload) => {
		SocketState.socket?.emit('create:task', { ...payload, spaceId });
		setBoard((oldBoard) => {
			const newBoard = {
				...oldBoard,
				columns: oldBoard?.columns?.map((column) => {
					if (column.id === payload.columnId) {
						return {
							...column,
							tasks: [...column.tasks, payload],
						};
					}
					return column;
				}),
			} as TBoard;

			return newBoard;
		});
	};

	const updateTasksOrder = (payload: UpdateTaskOrderPayload) => {
		SocketState.socket?.emit('update:task-order', { ...payload, spaceId });
		setBoard((oldBoard) => {
			const columns = oldBoard?.columns || [];
			const column = columns.find(({ id }) => id === payload.source.columnId);
			const copiedItems = column?.tasks ? [...column.tasks] : [];
			const [removed] = copiedItems.splice(payload.source.taskIndex, 1);

			copiedItems.splice(payload.destination.taskIndex, 0, removed);

			const newColumns = columns.map((inner_collumn) => {
				if (inner_collumn.id === payload.source.columnId) {
					return {
						...inner_collumn,
						tasks: copiedItems,
					};
				}
				return inner_collumn;
			});
			const newBoard = {
				...oldBoard,
				columns: newColumns,
			} as TBoard;

			return newBoard;
		});
	};

	const updateTasksColumn = (payload: UpdateTaskOrderPayload) => {
		SocketState.socket?.emit('update:task-column', { ...payload, spaceId });

		setBoard((oldBoard) => {
			const columns = oldBoard?.columns || [];
			const sourceColumn = columns.find(
				({ id }) => id === payload.source.columnId,
			);
			const destColumn = columns.find(
				({ id }) => id === payload.destination.columnId,
			);
			const sourceItems = sourceColumn?.tasks ? [...sourceColumn.tasks] : [];
			const destItems = destColumn?.tasks ? [...destColumn.tasks] : [];
			const [removed] = sourceItems.splice(payload.source.taskIndex, 1);
			destItems.splice(payload.destination.taskIndex, 0, removed);

			const newColumns = columns.map((column) => {
				if (column.id === payload.source.columnId) {
					return {
						...column,
						tasks: sourceItems,
					};
				}
				if (column.id === payload.destination.columnId) {
					return {
						...column,
						tasks: destItems,
					};
				}
				return column;
			});

			const newBoard = {
				...oldBoard,
				columns: newColumns,
			} as TBoard;
			return newBoard;
		});
	};

	const moveTask = (payload: MoveTaskPayload) => {
		if (!payload) return;
		SocketState.socket?.emit('move:task', { ...payload, spaceId });

		setClientMovingTask(payload.taskId);
	};
	const moveEndTask = (payload: { taskId: string }) => {
		SocketState.socket?.emit('move-end:task', { ...payload, spaceId });
		setClientMovingTask('');
	};

	const StartListners = () => {
		type CreateColumnResponse = {
			id: string;
			name: string;
			index: number;
			boardId: string | null;
		};
		SocketState.socket?.on('create:column', (payload: CreateColumnResponse) => {
			setBoard((oldBoard) => {
				const newBoard = {
					...oldBoard,
					columns: [...(oldBoard?.columns || []), { ...payload, tasks: [] }],
				} as TBoard;

				return newBoard;
			});
		});

		type CreateTaskResponse = {
			id: string;
			name: string;
			index: number;
			columnId: string | null;
		};
		SocketState.socket?.on('create:task', (payload: CreateTaskResponse) => {
			setBoard((oldBoard) => {
				const newBoard = {
					...oldBoard,
					columns: oldBoard?.columns?.map((column) => {
						if (column.id === payload.columnId) {
							return {
								...column,
								tasks: [...column.tasks, payload],
							};
						}
						return column;
					}),
				} as TBoard;

				return newBoard;
			});
		});

		SocketState.socket?.on(
			'update:task-order',
			(payload: UpdateTaskOrderPayload) => {
				setBoard((oldBoard) => {
					const columns = oldBoard?.columns || [];
					const column = columns.find(
						({ id }) => id === payload.source.columnId,
					);
					const copiedItems = column?.tasks ? [...column.tasks] : [];
					const [removed] = copiedItems.splice(payload.source.taskIndex, 1);

					copiedItems.splice(payload.destination.taskIndex, 0, removed);

					const newColumns = columns.map((inner_collumn) => {
						if (inner_collumn.id === payload.source.columnId) {
							return {
								...inner_collumn,
								tasks: copiedItems,
							};
						}
						return inner_collumn;
					});
					const newBoard = {
						...oldBoard,
						columns: newColumns,
					} as TBoard;

					return newBoard;
				});
			},
		);

		SocketState.socket?.on(
			'update:task-column',
			(payload: UpdateTaskOrderPayload) => {
				setBoard((oldBoard) => {
					const columns = oldBoard?.columns || [];
					const sourceColumn = columns.find(
						({ id }) => id === payload.source.columnId,
					);
					const destColumn = columns.find(
						({ id }) => id === payload.destination.columnId,
					);
					const sourceItems = sourceColumn?.tasks
						? [...sourceColumn.tasks]
						: [];
					const destItems = destColumn?.tasks ? [...destColumn.tasks] : [];
					const [removed] = sourceItems.splice(payload.source.taskIndex, 1);
					destItems.splice(payload.destination.taskIndex, 0, removed);

					const newColumns = columns.map((column) => {
						if (column.id === payload.source.columnId) {
							return {
								...column,
								tasks: sourceItems,
							};
						}
						if (column.id === payload.destination.columnId) {
							return {
								...column,
								tasks: destItems,
							};
						}
						return column;
					});

					const newBoard = {
						...oldBoard,
						columns: newColumns,
					} as TBoard;
					return newBoard;
				});
			},
		);

		SocketState.socket?.on(
			'move:task',
			({ taskId, style }: MoveTaskPayload) => {
				setTaskMoveEvent({
					taskId,
					style,
				});
			},
		);

		SocketState.socket?.on('move-end:task', () => {
			setTaskMoveEvent({
				taskId: '',
				style: {} as TaskStyle,
			});
		});
	};

	useEffect(() => {
		if (SocketState.socket) StartListners();
	}, [SocketState.socket]);

	return (
		<BoardContext.Provider
			value={{
				board,
				createColumn,
				updateTasksColumn,
				createTask,
				updateTasksOrder,
				moveTask,
				taskMoveEvent,
				moveEndTask,
				clientMovingTask,
			}}
		>
			{children}
		</BoardContext.Provider>
	);
}
export { BoardContext };
