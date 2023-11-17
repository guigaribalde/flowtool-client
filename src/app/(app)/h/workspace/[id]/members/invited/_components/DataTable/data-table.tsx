'use client';

import {
	ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { useMemo } from 'react';
import { DefaultDataTable } from '@/components/ui/default-data-table';
import useUsers from '../../../_utils/hooks/useUsers';
import { User } from '../../../_utils/context/UsersContext';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const { deleteInvitationMutation, query } = useUsers();
	const { users } = query.data as { users: User[] };

	const data = useMemo(() => {
		return users.filter((user: User) => {
			return (
				user.inviteStatus === 'declined' || user.inviteStatus === 'pending'
			);
		});
	}, [query.data]) as TData[];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		meta: {
			removeUser: (id: string) => {
				deleteInvitationMutation.mutate({ userId: id });
			},
		},
	});

	return <DefaultDataTable table={table} columnsLength={columns.length} />;
}
