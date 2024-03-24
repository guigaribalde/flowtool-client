'use client';

// import PointerBoard from '@components/core/cursor-board';
import { useSpace, InitialData } from '@/stores/space/space';
import { useContext, useEffect } from 'react';
import SocketContext from '@/utils/contexts/SocketContext/Context';
import { Socket } from 'socket.io-client';
import BoardContextProvider from './_utils/context/BoardContext';

interface ProvidersProps {
	spaceId: string;
	initialData: InitialData;
	children: React.ReactNode;
}

export default function Providers({
	spaceId,
	initialData,
	children,
}: ProvidersProps) {
	const build = useSpace((state) => state.build);
	const { socket } = useContext(SocketContext).SocketState;

	useEffect(() => {
		build(initialData, socket as Socket);
	}, []);

	return (
		<BoardContextProvider initialData={initialData.boards[0]} spaceId={spaceId}>
			{/* <PointerBoard /> */}
			{children}
		</BoardContextProvider>
	);
}
