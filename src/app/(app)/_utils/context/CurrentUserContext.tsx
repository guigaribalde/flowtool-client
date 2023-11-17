/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { User, UserOnWorkSpace, WorkSpace, Space } from '@prisma/client';
import { Dispatch, SetStateAction, createContext, useState } from 'react';

type TWSS = WorkSpace & {
	Space: Space[];
};

type TUOWS = UserOnWorkSpace & {
	workSpace: TWSS;
};

export type TUser = User & {
	UserOnWorkSpace: TUOWS[];
};

export interface CurrentUserContextState {
	user: TUser;
	setUser: Dispatch<SetStateAction<TUser>>;
}

const CurrentUserContext = createContext<CurrentUserContextState>(
	{} as CurrentUserContextState,
);

export default function CurrentUserContextProvider({
	children,
	currentUser,
}: {
	children: React.ReactNode;
	currentUser: TUser;
}) {
	const [user, setUser] = useState(currentUser);

	return (
		<CurrentUserContext.Provider value={{ user, setUser }}>
			{children}
		</CurrentUserContext.Provider>
	);
}
export { CurrentUserContext };
