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
import { TUser } from '@/app/(app)/_utils/context/CurrentUserContext';
import { User } from '../../../_utils/context/UsersContext';

const columnHelper = createColumnHelper<User>();

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'username',
		header: 'Nome',
		cell: ({ row }) => {
			const { username } = row.original;
			return <span className="capitalize">{username}</span>;
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'userRole',
		header: 'Cargo',
		cell: ({ row }) => {
			const { userRole } = row.original;
			if (userRole === 'owner')
				return (
					<div className="flex items-center gap-2 text-blue-600">
						<span className="h-2 w-2 rounded-full bg-blue-600" />
						<span>Dono</span>
					</div>
				);

			if (userRole === 'admin')
				return (
					<div className="flex items-center gap-2 text-green-600">
						<span className="h-2 w-2 rounded-full bg-green-600" />
						<span>Admin</span>
					</div>
				);

			if (userRole === 'member')
				return (
					<div className="flex items-center gap-2 text-gray-500">
						<span className="h-2 w-2 rounded-full bg-gray-500" />
						<span>Membro</span>
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

			const { removeUser, getCurrentUser, workspaceId } = meta as {
				removeUser: (id: string) => void;
				getCurrentUser: () => { user: TUser };
				workspaceId: string;
			};

			const currentUser = getCurrentUser().user;
			const currentUserOnSpace = currentUser.UserOnWorkSpace.find(
				(uowp) =>
					uowp.userId === currentUser.id && uowp.workSpaceId === workspaceId,
			);
			const isCurrentUser = currentUserOnSpace?.id === id;

			const isAdmin =
				currentUserOnSpace?.userRole === 'admin' ||
				currentUserOnSpace?.userRole === 'owner';

			if (isCurrentUser || !isAdmin) return null;

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
