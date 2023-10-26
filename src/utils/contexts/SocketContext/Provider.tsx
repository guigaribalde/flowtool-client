'use client';

import useSocket from '@/utils/hooks/useSocket';
import { useEffect, useReducer } from 'react';
import { URI } from '@/utils/constants';
import {
	SocketContextProvider,
	SocketReducer,
	defaultScoketContextState,
} from './Context';

export default function SocketContextProviderComponent({
	children,
}: {
	children: React.ReactNode;
}) {
	const [SocketState, SocketDispatch] = useReducer(
		SocketReducer,
		defaultScoketContextState,
	);
	const socket = useSocket(URI, {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	});

	const StartListeners = () => {
		socket.on('user_connected', (users: string[]) => {
			SocketDispatch({ type: 'update:users', payload: users });
		});

		socket.on('user_disconnected', (uid: string) => {
			SocketDispatch({ type: 'remove:user', payload: uid });
		});

		socket.io.on('reconnect', (attempt: number) => {
			console.info(`Reconnected after ${attempt} attempts`);
		});

		socket.io.on('reconnect_attempt', (attempt: number) => {
			console.info(`Trying and reconnect. ${attempt} attempts`);
		});

		socket.io.on('reconnect_error', (error: Error) => {
			console.info(`Error while trying to reconnect. ${error}`);
		});

		socket.io.on('reconnect_failed', () => {
			console.info(`Failed to reconnect`);
		});
	};

	const SendHandshake = () => {
		const callback = (uid: string, users: string[]) => {
			SocketDispatch({ type: 'update:uid', payload: uid });
			SocketDispatch({ type: 'update:users', payload: users });
		};
		socket.emit('handshake', callback);
	};

	useEffect(() => {
		socket.connect();
		SocketDispatch({ type: 'update:socket', payload: socket });
		StartListeners();
		SendHandshake();
	}, []);

	return (
		<SocketContextProvider value={{ SocketState, SocketDispatch }}>
			{children}
		</SocketContextProvider>
	);
}
