import { useEffect, useRef } from 'react';
import io, {
	type ManagerOptions,
	type SocketOptions,
	type Socket,
} from 'socket.io-client';

export default function useSocket(
	uri: string,
	opts: Partial<ManagerOptions & SocketOptions> | undefined,
): Socket {
	const { current: socket } = useRef(io(uri, opts));

	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return socket;
}
