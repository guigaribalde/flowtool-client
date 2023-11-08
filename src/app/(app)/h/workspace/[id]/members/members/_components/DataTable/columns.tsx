'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
	PiDotsThreeOutlineVerticalFill,
	PiUserMinusBold,
} from 'react-icons/pi';

export type User = {
	id: string;
	email: string;
	status: 'online' | 'offline' | null;
	username: string;
};
const columnHelper = createColumnHelper<User>();

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'username',
		header: 'Username',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const { status } = row.original;
			return (
				<div className="flex items-center gap-2">
					<div
						className={`h-2 w-2 rounded-full ${
							status === 'online' ? 'bg-green-500' : 'bg-slate-500'
						}`}
					/>
					<span>{status}</span>
				</div>
			);
		},
	},
	columnHelper.display({
		id: 'edit',
		cell: ({ row, table }) => {
			const { meta } = table.options;
			if (!meta) return null;

			const { id } = row.original;
			const { removeUser } = meta as {
				removeUser: (id: string) => void;
				changePermission: (id: string) => void;
			};

			return (
				<div className="flex w-full justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="btn btn-primary btn-ghost btn-sm">
								<PiDotsThreeOutlineVerticalFill className="text-md" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="end">
							<DropdownMenuItem
								onClick={() => removeUser(id)}
								className="flex cursor-pointer items-center gap-2"
							>
								<PiUserMinusBold />
								<span>Expulsar</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	}),
];
