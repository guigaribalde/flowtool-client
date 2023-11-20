import { isOnSpace } from '@auth/index';
import prisma from '@prisma/prisma';
import Navbar from '@components/layout/ui/Navbar';
import { Client } from './client';

type LayoutParams = {
	params: {
		id: string;
	};
	children: React.ReactNode;
};

export default async function Layout({ children, params }: LayoutParams) {
	const isOS = await isOnSpace(params.id);
	if (!isOS) return <div>Not found</div>;
	await prisma.$disconnect();

	return <Client params={params}>{children}</Client>;
}
