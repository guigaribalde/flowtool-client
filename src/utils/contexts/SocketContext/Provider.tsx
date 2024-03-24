'use client';

import useSocket from '@/utils/hooks/useSocket';
import { useEffect, useReducer } from 'react';
import { URI } from '@/utils/constants';
import { useAuth } from '@clerk/nextjs';
import { User } from '@prisma/client';
import { useAppMetadata } from '@/stores/app-metadata/app-metadata';
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
	const user = useAppMetadata((state) => state.user);
	const [SocketState, SocketDispatch] = useReducer(
		SocketReducer,
		defaultSocketContextState,
	);
	const socket = useSocket(URI, {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
		auth: async (cb) => {
			cb({
				token: await getToken({
					template: 'teste',
					leewayInSeconds: 60 * 60 * 24 * 30, // 30 days
				}),
			});
		},
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

		socket.on('connect', () => {
			console.log('we are connected!');
		});
		socket.on('disconnect', (reason) => {
			console.log('we are disconnected!', reason);
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
			// const t = await getToken();
			// socket.auth = { token: t };

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
