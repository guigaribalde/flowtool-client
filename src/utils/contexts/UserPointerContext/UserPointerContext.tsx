'use client';

import { useAppMetadata } from '@/stores/app-metadata/app-metadata';
import { URI as BASE_URL } from '@/utils/constants';
import useSocket from '@/utils/hooks/useSocket';
import { debounce } from '@/utils/utils';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export type Cursor = {
	x: number;
	y: number;
	name: string;
	lastUpdate: number;
	buttons: 0 | 1 | 2 | 3 | 4 | 5;
	draggableId: string | null;
};
type Pointer = {
	[uid: string]: Cursor;
};

export interface UserPointerContextState {
	pointers: Pointer;
	setPointers: React.Dispatch<React.SetStateAction<Pointer>>;
}

const UserPointerContext = createContext<UserPointerContextState>(
	{} as UserPointerContextState,
);

const URI = `${BASE_URL}/cursor`;

let lockedTarget = '';
let lastCursorPayload = {};

export default function UserPointerContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pointers, setPointers] = useState({} as Pointer);
	const user = useAppMetadata((state) => state.user);

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
		const {
			clientX: x,
			clientY: y,
			buttons,
			target,
			x: xx,
			y: yy,
			pageX,
			pageY,
			offsetX,
			offsetY,
			screenX,
			screenY,
			movementX,
			movementY,
		} = ev;
		// console.log(
		// 	// xx,
		// 	yy,
		// 	// pageX,
		// 	pageY,
		// 	// offsetX,
		// 	offsetY,
		// 	// screenX,
		// 	screenY,
		// 	// movementX,
		// 	// movementY,
		// );
		const draggableId =
			target instanceof HTMLElement
				? target.getAttribute('data-rbd-draggable-id')
				: null;

		if (buttons === 0 && draggableId) {
			lockedTarget = draggableId;
		}

		if (buttons === 0 && !draggableId) {
			lockedTarget = '';
		}

		const maxX = window.innerWidth;
		const maxY = window.innerHeight;

		const boardElement = document.getElementById('board-wrapper');
		const boardDimensions = boardElement!.getBoundingClientRect();
		const columnsElements = document.querySelectorAll(
			'[data-rbd-droppable-id]',
		);

		const currentColumn = Array.from(columnsElements).find((column) => {
			const columnDimensions = column.getBoundingClientRect();
			const { left, right } = columnDimensions;
			return x > left && x < right;
		});
		const columnScroll = currentColumn?.scrollTop || 0;

		const payload = {
			uid: user.id,
			name: user.username,
			x: x + boardElement!.scrollLeft - boardDimensions.left,
			y: y - boardDimensions.top,
			maxX,
			maxY,
			buttons,
			draggableId: lockedTarget,
		};
		// console.log(payload);
		lastCursorPayload = payload;

		socket.emit('cursor:update-position', payload);
	};

	const StartListeners = () => {
		socket.on(
			'cursor:update-position',
			({ uid, x, y, name, buttons, draggableId }) => {
				setPointers((oldPointers) => {
					return {
						...oldPointers,
						[uid]: {
							x,
							y,
							name,
							buttons,
							lastUpdate: Date.now(),
							draggableId,
						},
					};
				});
			},
		);
	};

	useInterval(() => {
		setPointers((oldPointers) => {
			const newPointers = { ...oldPointers };
			Object.keys(newPointers).forEach((uid) => {
				if (Date.now() - newPointers[uid].lastUpdate > 1000) {
					delete newPointers[uid];
				}
			});
			return newPointers;
		});
	}, 5000);

	useEffect(() => {
		socket.connect();
		StartListeners();

		const debouncedSendCurrentPosition = debounce(
			(e) => SendCurrentCursorPosition(e),
			1 / 2,
		);

		window.addEventListener('keypress', (e) => {
			if (e.target instanceof HTMLInputElement) {
				socket.emit('cursor:update-position', {
					...lastCursorPayload,
					buttons: 5,
				});
			}
		});
		window.addEventListener('pointermove', debouncedSendCurrentPosition);
		window.addEventListener('pointerdown', SendCurrentCursorPosition);
		window.addEventListener('pointerup', SendCurrentCursorPosition);
		return () => {
			window.removeEventListener('pointermove', debouncedSendCurrentPosition);
			window.removeEventListener('pointerdown', SendCurrentCursorPosition);
			window.removeEventListener('pointerup', SendCurrentCursorPosition);
		};
	}, []);

	return (
		<UserPointerContext.Provider value={value}>
			{children}
		</UserPointerContext.Provider>
	);
}
export { UserPointerContext };
