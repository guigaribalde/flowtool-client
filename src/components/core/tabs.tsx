'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Tabs({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* eslint-disable-next-line prettier/prettier */}
				<div className="tabs tabs-boxed">
				  {children}
			</div>
		</>
	);
}

function Tab({ href, name }: { href: string; name: string }) {
	const pathname = usePathname();
	return (
		<Link
			href={href}
			className={`tab px-7 ${href === pathname ? 'tab-active' : ''}`}
		>
			{name}
		</Link>
	);
}

Tabs.Tab = Tab;

export default Tabs;
