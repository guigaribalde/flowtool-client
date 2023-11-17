'use client';

import { useClerk } from '@clerk/nextjs';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../../public/logo-black-small.svg';

export default function Navbar({ username }: { username: string }) {
	const { signOut } = useClerk();

	return (
		<div className="w-full border-b border-b-slate-300 bg-white px-6 py-2">
			<div className="mx-auto flex items-center justify-between">
				<Link href="/h/spaces" passHref>
					<div className="flex items-center gap-2">
						<Image src={Logo} alt="Logo" />
						<span className="mr-5 text-lg font-semibold">inPlanning</span>
					</div>
				</Link>
				<div className="flex items-center gap-5">
					<span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<div className="avatar placeholder cursor-pointer">
									<div className="w-8 rounded-full bg-neutral text-neutral-content">
										<span className="text-md">{username[0].toUpperCase()}</span>
									</div>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="bottom" align="end">
								<DropdownMenuItem
									onClick={() => {
										signOut();
									}}
									className="flex cursor-pointer items-center gap-2"
								>
									<span>Sair</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</span>
				</div>
			</div>
		</div>
	);
}
