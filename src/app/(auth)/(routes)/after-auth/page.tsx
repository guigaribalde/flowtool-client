'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { type User } from '@prisma/client';

export default function Page() {
	const router = useRouter();
	const { signOut } = useClerk();

	const getUser = async () => {
		const response = await fetch('/api/after-auth');
		try {
			const { user }: { user: User } = await response.json();
			if (user) {
				return router.push('/h/spaces');
			}
		} catch (e) {
			return signOut();
		}
		return signOut();
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center gap-3">
				<p>Aguarde enquanto estamos preparando sua conta</p>
				<span className="loading loading-dots loading-lg" />
			</div>
		</div>
	);
}
