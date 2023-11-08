'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import InviteMembers from './_components/ui/invite-members';

export default function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id: string };
}): React.ReactNode {
	const pathname = usePathname();
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex w-full items-center justify-between">
				<h1 className="text-xl font-semibold text-slate-700">Membros</h1>
				<InviteMembers workspaceId={params.id} />
			</div>
			<div>
				{/* eslint-disable-next-line prettier/prettier */}
				<div className="tabs tabs-boxed">
					<Link
						href={`/h/workspace/${params.id}/members/members`}
						className={`tab px-7 ${
							`/h/workspace/${params.id}/members/members` === pathname
								? 'tab-active'
								: ''
						}`}
					>
						Membros
					</Link>
					<Link
						href={`/h/workspace/${params.id}/members/invited`}
						className={`tab px-7 ${
							`/h/workspace/${params.id}/members/invited` === pathname
								? 'tab-active'
								: ''
						}`}
					>
						Convidados
					</Link>
				</div>
				{children}
			</div>
		</div>
	);
}
