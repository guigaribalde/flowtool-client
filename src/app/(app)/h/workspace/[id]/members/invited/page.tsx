import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { User, columns } from './_components/DataTable/columns';
import { DataTable } from './_components/DataTable/data-table';
import { getInvited } from '../_utils';

type PageParams = {
	params: {
		id: string;
	};
};

export default async function Page({ params }: PageParams) {
	const { id } = params;
	const currentUser = await getClerkCurrentUser();
	if (!currentUser) return redirect('/sign-in');

	const user = await prisma.user.findUnique({
		where: {
			clerkId: currentUser.id,
		},
		include: {
			UserOnWorkSpace: {
				include: {
					workSpace: true,
				},
			},
		},
	});

	if (!user) return <div>Erro</div>;
	if (!user.UserOnWorkSpace.find((u) => u.workSpaceId === id))
		return <div>Quadro nao encontrado</div>;

	const workSpace = await getInvited(id);

	if (!workSpace) return <div>Erro</div>;
	const users = workSpace.UserOnWorkSpace.flatMap((u) => u) as User[];

	if (!users) return <div>Erro</div>;

	return (
		<div className="mt-2">
			<DataTable columns={columns} data={users} />
		</div>
	);
}
