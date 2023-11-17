'use client';

import { columns } from './columns';
import { DataTable } from './data-table';
import useUsers from '../../../_utils/hooks/useUsers';

export default function Client({ workspaceId }: { workspaceId: string }) {
	const { query } = useUsers();

	if (query.isLoading)
		return (
			<div className="mt-2 h-40 w-full animate-pulse rounded-md bg-slate-300" />
		);

	return (
		<div className="mt-2">
			<DataTable columns={columns} workspaceId={workspaceId} />
		</div>
	);
}
