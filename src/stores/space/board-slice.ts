import { Board } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface BoardSlice {
	boards: Record<string, Board>;
	addBoard: (board: Board) => void;
	deleteBoard: (boardId: string) => void;
	updateBoard: (boardId: string, board: Partial<Board>) => void;
	boardsToArray: () => Board[];
}

type CreateBoardSlice = StateCreator<BoardSlice>;

export const createBoardSlice: CreateBoardSlice = (set, get: any) => ({
	boards: {},
	addBoard: (board: Board) => {
		set((state: any) => ({ boards: { ...state.boards, [board.id]: board } }));
	},
	deleteBoard: (boardId: string) =>
		set((state: any) => {
			const { [boardId]: deleted, ...boards } = state.boards;
			return { boards };
		}),
	updateBoard: (boardId: string, board: Partial<Board>) => {
		if (boardId in get().boards) {
			set((state: any) => ({
				boards: {
					...state.boards,
					[boardId]: { ...state.boards[boardId], ...board },
				},
			}));
		}
	},
	boardsToArray: () => Object.values(get().boards),
});
