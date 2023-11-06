import {
	PiCaretLeftBold,
	PiCaretRightBold,
	PiCaretDoubleLeft,
	PiCaretDoubleRight,
} from 'react-icons/pi';
import { Table } from '@tanstack/react-table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Membros Exibidos</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Pagina {table.getState().pagination.pageIndex + 1} de{' '}
						{table.getPageCount()}
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<button
						type="button"
						className="btn btn-sm hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<PiCaretDoubleLeft className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="btn btn-sm h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<PiCaretLeftBold className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="btn btn-sm h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<PiCaretRightBold className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="btn btn-sm hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<PiCaretDoubleRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
