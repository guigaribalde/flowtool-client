'use client';

import BoardContextProvider, { TBoard } from './_utils/context/BoardContext';

interface ProvidersProps {
	spaceId: string;
	board: TBoard;
	children: React.ReactNode;
}

export default function Providers({
	spaceId,
	board,
	children,
}: ProvidersProps) {
	return (
		<BoardContextProvider initialData={board} spaceId={spaceId}>
			{children}
		</BoardContextProvider>
	);
}
