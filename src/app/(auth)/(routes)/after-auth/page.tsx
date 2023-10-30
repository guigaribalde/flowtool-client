'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

export default function Page() {
	const router = useRouter();
	const { signOut } = useClerk();

	const getUser = async () => {
		const response = await fetch('/api/after-auth');
		const { user } = await response.json();
		console.log({ user });
		if (user) {
			if (!user.companyId) return router.push('/app/setup');
			return router.push('/app');
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
