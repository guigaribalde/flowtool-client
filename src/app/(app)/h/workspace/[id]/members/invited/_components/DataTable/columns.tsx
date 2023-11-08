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
	invitedUserEmail: string;
	inviteStatus: string;
};
const columnHelper = createColumnHelper<User>();

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'invitedUserEmail',
		header: 'Email',
	},
	{
		accessorKey: 'inviteStatus',
		header: 'Status',
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
