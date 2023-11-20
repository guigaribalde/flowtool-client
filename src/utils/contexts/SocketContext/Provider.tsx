'use client';

import useSocket from '@/utils/hooks/useSocket';
import { useEffect, useReducer } from 'react';
import { URI } from '@/utils/constants';
import { useAuth } from '@clerk/nextjs';
import useCurrentUser from '@/app/(app)/_utils/hooks/useCurrentUser';
import { User } from '@prisma/client';
import {
	SocketContextProvider,
	SocketReducer,
	defaultSocketContextState,
} from './Context';

export default function SocketContextProviderComponent({
	children,
	spaceId,
}: {
	children: React.ReactNode;
	spaceId: string;
}) {
	const { getToken } = useAuth();
	const { user } = useCurrentUser();
	const [SocketState, SocketDispatch] = useReducer(
		SocketReducer,
		defaultSocketContextState,
	);
	const socket = useSocket(URI, {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	});

	const StartListeners = () => {
		socket.on('update:users', (users: User[]) => {
			console.log(users);
			SocketDispatch({ type: 'update:users', payload: users });
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
		const callback = (uid: string, users: User[]) => {
			console.log(uid, users);
			SocketDispatch({ type: 'update:uid', payload: uid });
			SocketDispatch({ type: 'update:users', payload: users });
		};
		socket.emit('user:handshake', { spaceId, userId: user.id }, callback);
	};

	useEffect(() => {
		const token = async () => {
			const t = await getToken();
			socket.auth = { token: t };

			socket.connect();
			SocketDispatch({ type: 'update:socket', payload: socket });

			StartListeners();
			SendHandshake();
		};
		token();
	}, []);

	return (
		<SocketContextProvider value={{ SocketState, SocketDispatch }}>
			{children}
		</SocketContextProvider>
	);
}
