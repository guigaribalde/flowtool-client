import { User } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface UserSlice {
	user: User;
	updateUser: (user: Partial<User>) => void;
}

type CreateUserSlice = StateCreator<UserSlice>;

export const createUserSliece: CreateUserSlice = (set, get) => ({
	user: {} as User,
	updateUser: (user: Partial<User>) => {
		set((state: any) => ({
			user: {
				...state.user,
				...user,
			},
		}));
	},
});
