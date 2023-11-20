import { type Socket } from 'socket.io-client';
import { createContext } from 'react';
import { User } from '@prisma/client';

export interface ISocketContextState {
	socket: Socket | undefined;
	uid: string;
	users: User[];
	context: string;
}

export const defaultSocketContextState: ISocketContextState = {
	socket: undefined,
	uid: '',
	users: [],
	context: '',
};

export type TSocketContextActions =
	| 'update:socket'
	| 'update:uid'
	| 'update:users';

export type TSocketContextPayload = string | User[] | Socket;

export interface ISocketContextActions {
	type: TSocketContextActions;
	payload: TSocketContextPayload;
}

export const SocketReducer = (
	state: ISocketContextState,
	action: ISocketContextActions,
): ISocketContextState => {
	switch (action.type) {
		case 'update:socket':
			return {
				...state,
				socket: action.payload as Socket,
			};
		case 'update:uid':
			return {
				...state,
				uid: action.payload as string,
			};
		case 'update:users':
			return {
				...state,
				users: action.payload as User[],
			};
		default:
			return state;
	}
};

export interface ISocketContextProps {
	SocketState: ISocketContextState;
	SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
	SocketState: defaultSocketContextState,
	SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
