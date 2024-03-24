import { UserOnWorkSpace } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface UserOnWorkspaceSlice {
	userOnWorkSpaces: Record<string, UserOnWorkSpace>;
	addUserOnWorkSpace: (userOnWorkSpace: UserOnWorkSpace) => void;
	deleteUserOnWorkSpace: (userOnWorkSpaceId: string) => void;
	updateUserOnWorkSpace: (
		userOnWorkSpaceId: string,
		userOnWorkSpace: Partial<UserOnWorkSpace>,
	) => void;
	userOnWorkSpacesToArray: () => UserOnWorkSpace[];
}

type UserOnWorkspaceSliceCreator = StateCreator<UserOnWorkspaceSlice>;

export const createUserOnWorkSpaceSliece: UserOnWorkspaceSliceCreator = (
	set,
	get,
) => ({
	userOnWorkSpaces: {},
	addUserOnWorkSpace: (userOnWorkSpace: UserOnWorkSpace) => {
		set((state: any) => ({
			userOnWorkSpaces: {
				...state.userOnWorkSpaces,
				[userOnWorkSpace.id]: userOnWorkSpace,
			},
		}));
	},
	deleteUserOnWorkSpace: (userOnWorkSpaceId: string) =>
		set((state: any) => {
			const { [userOnWorkSpaceId]: deleted, ...userOnWorkSpaces } =
				state.userOnWorkSpaces;
			return { userOnWorkSpaces };
		}),
	updateUserOnWorkSpace: (
		userOnWorkSpaceId: string,
		userOnWorkSpace: Partial<UserOnWorkSpace>,
	) => {
		if (userOnWorkSpaceId in get().userOnWorkSpaces) {
			set((state: any) => ({
				userOnWorkSpaces: {
					...state.userOnWorkSpaces,
					[userOnWorkSpaceId]: {
						...state.userOnWorkSpaces[userOnWorkSpaceId],
						...userOnWorkSpace,
					},
				},
			}));
		}
	},
	userOnWorkSpacesToArray: () => Object.values(get().userOnWorkSpaces),
});
