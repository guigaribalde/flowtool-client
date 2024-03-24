import prisma from '@prisma/prisma';
import Board from './_components/board';
import { TBoard } from './_utils/context/BoardContext';
import Providers from './providers';

type PageParams = {
	params: {
		id: string;
	};
};

export default async function Page({ params }: PageParams) {
	const space = await prisma.space.findUnique({
		where: {
			id: params.id,
		},
		include: {
			boards: {
				include: {
					columns: {
						include: {
							tasks: {
								orderBy: {
									index: 'asc',
								},
							},
						},
						orderBy: {
							index: 'asc',
						},
					},
				},
			},
		},
	});

	await prisma.$disconnect();

	if (!space) return null;

	return (
		<div
			id="board-wrapper"
			className="h-full w-full overflow-x-auto bg-gray-100"
		>
			<div className="relative flex h-full min-w-fit gap-6 px-9 pt-8">
				<Providers spaceId={params.id} initialData={space}>
					<Board spaceId={params.id} />
				</Providers>
			</div>
		</div>
	);
}
