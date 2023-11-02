'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Footer from './_components/ui/footer';
import Header from './_components/ui/header';

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		AOS.init({
			once: true,
			disable: 'phone',
			duration: 700,
			easing: 'ease-out-cubic',
		});
	});

	return (
		<div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
			<Header />
			<main className="grow">{children}</main>

			<Footer />
		</div>
	);
}
