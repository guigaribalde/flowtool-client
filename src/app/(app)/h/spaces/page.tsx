import prisma from '@prisma/prisma';
import { PiPlus } from 'react-icons/pi';
import { currentUser as getClerkCurrentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
	const currentUser = await getClerkCurrentUser();
	if (!currentUser) return redirect('/sign-in');

	const user = await prisma.user.findUnique({
		where: {
			clerkId: currentUser.id,
		},
		include: {
			UserOnWorkSpace: {
				include: {
					workSpace: {
						include: {
							Space: true,
						},
					},
				},
			},
		},
	});

	if (!user) return <div>Erro</div>;
	const spaces = user.UserOnWorkSpace.flatMap((u) => u.workSpace.Space);

	return (
		<div className="flex w-full flex-col">
			<h1 className="text-xl font-semibold text-slate-700">Seus espacos</h1>
			<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{spaces.map(({ id, name }) => (
					<div
						key={id}
						className="h-24 w-full cursor-pointer rounded-lg bg-gradient-to-br from-cyan-300 to-cyan-500 p-3 transition-all duration-200 hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-100"
					>
						<span className="font-semibold text-slate-700">{name}</span>
					</div>
				))}
				<div className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-200 p-3 transition-all duration-200 hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-100">
					<span className="flex items-center gap-2 text-sm">
						<PiPlus />
						<span>Criar novo espaco</span>
					</span>
				</div>
			</div>
		</div>
	);
}
