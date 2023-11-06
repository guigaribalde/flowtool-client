'use client';

import { usePathname } from 'next/navigation';
import { PiKanbanFill } from 'react-icons/pi';
import Link from 'next/link';

export default function Spaces() {
	const pathname = usePathname();
	const decodedURI = decodeURI(pathname);

	return (
		<Link
			href="/h/spaces"
			className={`btn btn-ghost btn-sm flex justify-start capitalize ${
				decodedURI === '/h/spaces' ? 'btn-active' : ''
			}`}
			type="button"
		>
			<PiKanbanFill />
			Espacos
		</Link>
	);
}
