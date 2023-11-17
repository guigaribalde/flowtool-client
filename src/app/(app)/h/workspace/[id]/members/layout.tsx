'use client';

import Tabs from '@components/core/tabs';
import InviteMembers from './_components/ui/invite-members';
import UsersContextProvider from './_utils/context/UsersContext';

type LayoutParams = {
	params: {
		id: string;
	};
	children: React.ReactNode;
};
export default function Layout({
	children,
	params,
}: LayoutParams): React.ReactNode {
	return (
		<UsersContextProvider workspaceId={params.id}>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-between">
					<h1 className="text-xl font-semibold text-slate-700">Membros</h1>
					<InviteMembers />
				</div>
				<div>
					<Tabs>
						<Tabs.Tab
							href={`/h/workspace/${params.id}/members/members`}
							name="Membros"
						/>
						<Tabs.Tab
							href={`/h/workspace/${params.id}/members/invited`}
							name="Convidados"
						/>
					</Tabs>
					{children}
				</div>
			</div>
		</UsersContextProvider>
	);
}
