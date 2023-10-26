import { type Socket } from 'socket.io-client';
import { createContext } from 'react';

export interface ISocketContextState {
	socket: Socket | undefined;
	uid: string;
	users: string[];
	context: string;
}

export const defaultScoketContextState: ISocketContextState = {
	socket: undefined,
	uid: '',
	users: [],
	context: '',
};

export type TSocketContextActions =
	| 'update:socket'
	| 'update:uid'
	| 'update:users'
	| 'remove:user'
	| 'update:context';

export type TSocketContextPayload = string | string[] | Socket | Cursors;

export interface ISocketContextActions {
	type: TSocketContextActions;
	payload: TSocketContextPayload;
}

export const SocketReducer = (
	state: ISocketContextState,
	action: ISocketContextActions,
): ISocketContextState => {
	console.info(`Message Received: ${action.type} - Payload:`, action.payload);

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
				users: action.payload as string[],
			};
		case 'remove:user':
			return {
				...state,
				users: state.users.filter((user) => user !== action.payload),
			};
		case 'update:context':
			return {
				...state,
				context: action.payload as string,
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
	SocketState: defaultScoketContextState,
	SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
