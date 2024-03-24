import { Column } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface ColumnSlice {
	columns: Record<string, Column>;
	addColumn: (column: Column) => void;
	deleteColumn: (columnId: string) => void;
	updateColumn: (columnId: string, column: Partial<Column>) => void;
	columnsToArray: () => Column[];
	sortedColumns: () => Column[];
}

type CreateColumnSlice = StateCreator<ColumnSlice>;

export const createColumnSlice: CreateColumnSlice = (set, get: any) => ({
	columns: {},
	addColumn: (column: Column) => {
		set((state: any) => ({
			columns: { ...state.columns, [column.id]: column },
		}));
	},
	deleteColumn: (columnId: string) =>
		set((state: any) => {
			const { [columnId]: deleted, ...columns } = state.columns;
			return { columns };
		}),
	updateColumn: (columnId: string, column: Partial<Column>) => {
		if (columnId in get().columns) {
			set((state: any) => ({
				columns: {
					...state.columns,
					[columnId]: { ...state.columns[columnId], ...column },
				},
			}));
		}
	},
	sortedColumns: () => {
		const columns = get().columnsToArray();
		return columns.sort((a: Column, b: Column) => a.index - b.index);
	},
	columnsToArray: () => Object.values(get().columns),
});
