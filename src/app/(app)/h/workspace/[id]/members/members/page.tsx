import prisma from '@prisma/prisma';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import DataTable from './_components/DataTable';

type PageParams = {
	params: {
		id: string;
	};
};

export default async function Page({ params }: PageParams) {
	const { id: workspaceId } = params;
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
	await prisma.$disconnect();

	if (!user) return <div>Erro</div>;
	if (!user.UserOnWorkSpace.find((u) => u.workSpaceId === workspaceId))
		return <div>Quadro nao encontrado</div>;

	return <DataTable workspaceId={workspaceId} />;
}
