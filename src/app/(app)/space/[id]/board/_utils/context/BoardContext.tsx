/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { $Enums } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import {
	type UseQueryResult,
	useQuery,
	useMutation,
	UseMutationResult,
	useQueryClient,
} from '@tanstack/react-query';
import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { toast } from '@/components/ui/use-toast';
import SocketContext from '@/utils/contexts/SocketContext/Context';

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
	query: UseQueryResult<TBoard, Error>;
	createColumn: (payload: CreateColumnPayload) => void;
	board: TBoard;

	createTask: UseMutationResult<
		AxiosResponse<any, any>,
		Error,
		CreateTaskPayload,
		unknown
	>;

	updateTasksOrder: UseMutationResult<
		AxiosResponse<any, any>,
		Error,
		UpdateTaskOrderPayload,
		unknown
	>;

	updateTasksColumn: UseMutationResult<
		AxiosResponse<any, any>,
		Error,
		UpdateTaskOrderPayload,
		unknown
	>;

	setColumns: Dispatch<SetStateAction<TColumn[]>>;
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
	const { SocketState, SocketDispatch } = useContext(SocketContext);

	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ['board', spaceId],
		initialData,
	});

	const [board, setBoard] = useState<TBoard>(initialData);

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

	type CreateColumnResponse = {
		id: string;
		name: string;
		index: number;
		boardId: string | null;
	};
	const StartListners = () => {
		SocketState.socket?.on('create:column', (payload: CreateColumnResponse) => {
			setBoard((oldBoard) => {
				const newBoard = {
					...oldBoard,
					columns: [...(oldBoard?.columns || []), { ...payload, tasks: [] }],
				} as TBoard;

				return newBoard;
			});
		});
	};

	useEffect(() => {
		if (SocketState.socket) StartListners();
	}, [SocketState.socket]);

	// const createColumn = useMutation({
	// 	mutationFn: async (payload: CreateColumnPayload) => {
	// 		return axios.post('/api/column/create', payload);
	// 	},
	// 	onMutate: (payload) => {
	// 		const newColumn = {
	// 			...payload,
	// 			boardId: null,
	// 		};
	// 		queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
	// 			const newData = {
	// 				...oldData,
	// 				columns: [...(oldData?.columns || []), newColumn],
	// 			};
	// 			return newData;
	// 		});
	// 	},
	// 	onError: (error, payload) => {
	// 		queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
	// 			const newData = {
	// 				...oldData,
	// 				columns: oldData?.columns?.filter(
	// 					(column) => column.id !== payload.id,
	// 				),
	// 			};
	// 			return newData;
	// 		});
	// 		toast({
	// 			title: 'Erro',
	// 			description: 'Ocorreu um erro ao criar uma coluna',
	// 			variant: 'destructive',
	// 		});
	// 	},
	// });

	const createTask = useMutation({
		mutationFn: async (payload: CreateTaskPayload) => {
			return axios.post('/api/task/create', payload);
		},
		onMutate: (payload) => {
			queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
				const newData = {
					...oldData,
					columns: oldData?.columns?.map((column) => {
						if (column.id === payload.columnId) {
							return {
								...column,
								tasks: [...column.tasks, payload],
							};
						}
						return column;
					}),
				};
				return newData;
			});
		},
		onError: (error, payload) => {
			queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
				const newData = {
					...oldData,
					columns: oldData?.columns?.map((column) => {
						if (column.id === payload.columnId) {
							return {
								...column,
								tasks: column.tasks.filter((task) => task.id !== payload.id),
							};
						}
						return column;
					}),
				};
				return newData;
			});
			toast({
				title: 'Erro',
				description: 'Ocorreu um erro ao criar um tarefa',
				variant: 'destructive',
			});
		},
	});

	const updateTasksOrder = useMutation({
		mutationFn: async ({
			source,
			taskId,
			destination,
		}: UpdateTaskOrderPayload) => {
			return axios.post('/api/task/update-order', {
				source,
				taskId,
				destination,
				spaceId,
			});
		},
		onMutate: ({ source, destination, taskId }) => {
			queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
				const columns = oldData?.columns || [];
				const column = columns.find(({ id }) => id === source.columnId);
				const copiedItems = column?.tasks ? [...column.tasks] : [];
				const [removed] = copiedItems.splice(source.taskIndex, 1);

				copiedItems.splice(destination.taskIndex, 0, removed);

				const newColumns = columns.map((inner_collumn) => {
					if (inner_collumn.id === source.columnId) {
						return {
							...inner_collumn,
							tasks: copiedItems,
						};
					}
					return inner_collumn;
				});

				return {
					...oldData,
					columns: newColumns,
				};
			});
		},
		onError: (error, payload) => {},
	});

	const updateTasksColumn = useMutation({
		mutationFn: async ({
			source,
			taskId,
			destination,
		}: UpdateTaskOrderPayload) => {
			return axios.post('/api/task/update-column', {
				source,
				taskId,
				destination,
				spaceId,
			});
		},
		onMutate: ({ source, destination, taskId }) => {
			queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
				const columns = oldData?.columns || [];
				const sourceColumn = columns.find(({ id }) => id === source.columnId);
				const destColumn = columns.find(
					({ id }) => id === destination.columnId,
				);
				const sourceItems = sourceColumn?.tasks ? [...sourceColumn.tasks] : [];
				const destItems = destColumn?.tasks ? [...destColumn.tasks] : [];
				const [removed] = sourceItems.splice(source.taskIndex, 1);
				destItems.splice(destination.taskIndex, 0, removed);

				const newColumns = columns.map((column) => {
					if (column.id === source.columnId) {
						return {
							...column,
							tasks: sourceItems,
						};
					}
					if (column.id === destination.columnId) {
						return {
							...column,
							tasks: destItems,
						};
					}
					return column;
				});

				return {
					...oldData,
					columns: newColumns,
				};
			});
		},
		onError: (error, payload) => {},
	});

	const setColumns: Dispatch<SetStateAction<TColumn[]>> = (columns) => {
		queryClient.setQueryData(['board', spaceId], (oldData: TBoard) => {
			const newData = {
				...oldData,
				columns,
			};
			return newData;
		});
	};

	return (
		<BoardContext.Provider
			value={{
				board,
				createColumn,
				updateTasksColumn,
				query,
				setColumns,
				createTask,
				updateTasksOrder,
			}}
		>
			{children}
		</BoardContext.Provider>
	);
}
export { BoardContext };
