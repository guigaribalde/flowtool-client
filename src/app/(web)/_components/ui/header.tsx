'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import Logo from './logo';
// import Dropdown from './. /utils/dropdown';
import MobileMenu from './mobile-menu';

export default function Header() {
	const [top, setTop] = useState<boolean>(true);

	// detect whether user has scrolled the page down by 10px
	const scrollHandler = () => {
		if (window.pageYOffset > 10) {
			setTop(false);
		} else {
			setTop(true);
		}
	};

	useEffect(() => {
		scrollHandler();
		window.addEventListener('scroll', scrollHandler);
		return () => window.removeEventListener('scroll', scrollHandler);
	}, [top]);

	return (
		<header
			className={`fixed z-30 w-full transition duration-300 ease-in-out md:bg-opacity-90 ${
				!top ? 'bg-white shadow-lg backdrop-blur-sm' : ''
			}`}
		>
			<div className="mx-auto max-w-6xl px-5 sm:px-6">
				<div className="flex h-16 items-center justify-between md:h-20">
					{/* Site branding */}
					<div className="mr-4 shrink-0">
						<Logo />
					</div>

					{/* Desktop navigation */}
					<nav className="hidden md:flex md:grow">
						{/* Desktop sign in links */}
						<ul className="flex grow flex-wrap items-center justify-end gap-3">
							<li>
								<Link href="/sign-in" passHref>
									<button type="button" className="btn btn-primary btn-sm">
										Entrar
									</button>
								</Link>
							</li>
							<li>
								<Link href="/sign-up" passHref>
									<button type="button" className="btn btn-sm">
										Cadastre-se
									</button>
								</Link>
							</li>
						</ul>
					</nav>

					<MobileMenu />
				</div>
			</div>
		</header>
	);
}
