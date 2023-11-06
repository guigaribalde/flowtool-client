'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PiLinkBold, PiUserPlusBold } from 'react-icons/pi';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import TextInput from '@/components/forms/TextInput';

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
				<Dialog>
					<DialogTrigger asChild>
						<button className="btn btn-primary btn-sm" type="button">
							<PiUserPlusBold />
							<span>Convidar membros</span>
						</button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Convidar Membro</DialogTitle>
							<DialogDescription>
								Convide membros para a sua Area de Trabalho para que eles possam
								acessar seus espaços de trabalho.
							</DialogDescription>
						</DialogHeader>
						<TextInput label="Email" placeholder="Endereço de email" />
						<div className="flex w-full items-center justify-between">
							<DialogDescription>
								Ou envie um convite por link
							</DialogDescription>
							<button className="btn btn-primary btn-sm" type="button">
								<PiLinkBold />
								Criar link
							</button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<div>
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
						href={`/h/workspace/${params.id}/members/guests`}
						className={`tab px-7 ${
							`/h/workspace/${params.id}/members/guests` === pathname
								? 'tab-active'
								: ''
						}`}
					>
						Convidados
					</Link>
					<Link
						href={`/h/workspace/${params.id}/members/pending`}
						className={`tab px-7 ${
							`/h/workspace/${params.id}/members/pending` === pathname
								? 'tab-active'
								: ''
						}`}
					>
						Pendentes
					</Link>
				</div>
				{children}
			</div>
		</div>
	);
}
