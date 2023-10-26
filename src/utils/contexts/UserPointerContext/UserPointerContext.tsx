'use client';

import { URI as BASE_URL } from '@/utils/constants';
import useSocket from '@/utils/hooks/useSocket';
import { debounce } from '@/utils/utils';
import { createContext, useEffect, useMemo, useState } from 'react';

type Position = {
	x: number;
	y: number;
};
type Pointer = {
	[uid: string]: Position;
};

export interface UserPointerContextState {
	pointers: Pointer;
	setPointers: React.Dispatch<React.SetStateAction<Pointer>>;
}

const UserPointerContext = createContext<UserPointerContextState>(
	{} as UserPointerContextState,
);

const URI = `${BASE_URL}/cursor`;

export default function UserPointerContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pointers, setPointers] = useState({} as Pointer);
	const socket = useSocket(URI, {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	});
	const value = useMemo(
		() => ({ pointers, setPointers }),
		[pointers, setPointers],
	);

	const SendCurrentCursorPosition = (ev: MouseEvent) => {
		const { clientX: x, clientY: y } = ev;
		// const { uid } = SocketState;

		const xShift = window.scrollX;
		const yShift = window.scrollY;

		const maxX = window.innerWidth;
		const maxY = window.innerHeight;

		socket.emit('cursor:update-position', {
			// uid,
			x,
			y,
			xShift,
			yShift,
			maxX,
			maxY,
		});
	};

	const StartListeners = () => {
		socket.on('cursor:update-position', ({ uid, x, y }) => {
			setPointers((oldPointers) => {
				return {
					...oldPointers,
					[uid]: {
						x,
						y,
					},
				};
			});
		});
	};

	useEffect(() => {
		socket.connect();
		StartListeners();

		const debouncedSendCurrentPosition = debounce(
			SendCurrentCursorPosition,
			1 / 2,
		);

		window.addEventListener('pointermove', debouncedSendCurrentPosition);
		return () => {
			window.removeEventListener('pointermove', debouncedSendCurrentPosition);
		};
	}, []);

	return (
		<UserPointerContext.Provider value={value}>
			{children}
		</UserPointerContext.Provider>
	);
}
export { UserPointerContext };
