'use client';

import { useClerk } from '@clerk/nextjs';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import SocketContext, {
	SocketReducer,
	defaultSocketContextState,
} from '@/utils/contexts/SocketContext/Context';
import { useContext, useEffect, useReducer } from 'react';
import Logo from '@public/logo-black-small.svg';

export default function Navbar({ username }: { username: string }) {
	const { signOut } = useClerk();
	const { SocketState } = useContext(SocketContext);

	const connectedUsers =
		SocketState?.users?.filter((user) => user.id !== SocketState?.uid) || [];

	return (
		<div className="w-full border-b border-b-slate-300 bg-white px-6 py-2">
			<div className="mx-auto flex items-center justify-between">
				<Link href="/h/spaces" passHref>
					<div className="flex items-center gap-2">
						<Image src={Logo} alt="Logo" />
						<span className="mr-5 text-lg font-semibold">inPlanning</span>
					</div>
				</Link>
				<div className="flex max-h-8 items-center gap-5">
					<div className="avatar-group -space-x-4 rtl:space-x-reverse">
						{connectedUsers.map((user) => {
							return (
								<div
									key={user.id}
									className="avatar placeholder cursor-pointer"
								>
									<div className="w-8 rounded-full bg-neutral text-neutral-content">
										<span className="text-md">
											{user.username[0].toUpperCase()}
										</span>
									</div>
								</div>
							);
						})}
					</div>

					<span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<div className="avatar placeholder cursor-pointer">
									<div className="w-8 rounded-full bg-neutral text-neutral-content">
										<span className="text-md">
											{username?.length ? username[0].toUpperCase() : '?'}
										</span>
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
