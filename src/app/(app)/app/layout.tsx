import type { Metadata } from 'next';
import SocketContextProviderComponent from '@/utils/contexts/SocketContext/Provider';
import PointerBoard from '@components/layout/core/PointerBoard';
import Navbar from '@components/layout/ui/Navbar';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	return (
		<div className="flex h-full w-full flex-col">
			<Navbar />
			<SocketContextProviderComponent>
				<PointerBoard />
				{children}
			</SocketContextProviderComponent>
		</div>
	);
}
