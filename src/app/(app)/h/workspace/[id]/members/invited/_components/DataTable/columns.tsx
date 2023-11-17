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
	PiClockFill,
	PiXCircleFill,
} from 'react-icons/pi';
import { User } from '../../../_utils/context/UsersContext';

const columnHelper = createColumnHelper<User>();

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'invitedUserEmail',
		header: 'Email',
	},
	{
		accessorKey: 'inviteStatus',
		header: 'Status',
		cell: ({ row }) => {
			const { inviteStatus } = row.original;

			if (inviteStatus === 'pending')
				return (
					<div className="flex items-center gap-2 text-slate-500">
						<PiClockFill />
						<span>Pendente</span>
					</div>
				);

			if (inviteStatus === 'declined')
				return (
					<div className="flex items-center gap-2 text-red-500">
						<PiXCircleFill />
						<span>Rejeitado</span>
					</div>
				);

			return null;
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
