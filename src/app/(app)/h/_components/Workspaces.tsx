'use client';

import { usePathname } from 'next/navigation';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@components/ui/accordion';
import { PiFolderFill, PiUsersBold, PiGearBold } from 'react-icons/pi';
import Link from 'next/link';

type Workspace = {
	id: string;
	name: string;
};
type WorkspacesProps = {
	workspaces: Workspace[];
};

export default function Workspaces({ workspaces }: WorkspacesProps) {
	const pathname = usePathname();
	const decodedURI = decodeURI(pathname);
	const activeWorkspace = decodedURI.split('/')[3] || '';
	return (
		<Accordion
			type="single"
			collapsible
			className="flex w-full flex-col gap-2"
			defaultValue={activeWorkspace}
		>
			{workspaces.map(({ name, id }) => (
				<AccordionItem key={id} value={id} className="border-b-0">
					<AccordionTrigger>
						<span className="flex gap-3 capitalize">
							<PiFolderFill />
							{name}
						</span>
					</AccordionTrigger>
					<AccordionContent className="mt-1">
						<Link
							href={`/h/workspace/${id}/members/members`}
							className={`btn btn-ghost btn-sm flex w-full justify-start px-9 font-medium capitalize ${
								decodedURI.includes(`/h/workspace/${id}/members`)
									? 'btn-active'
									: ''
							}`}
							type="button"
						>
							<PiUsersBold />
							Membros
						</Link>
						<Link
							href={`/h/workspace/${id}/config`}
							className={`btn btn-ghost btn-sm flex w-full justify-start px-9 font-medium capitalize ${
								`/h/workspace/${id}/config` === decodedURI ? 'btn-active' : ''
							}`}
							type="button"
						>
							<PiGearBold />
							Configuracoes
						</Link>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
