import { Space } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface SpaceSlice {
	spaces: Record<string, Space>;
	addSpace: (space: Space) => void;
	deleteSpace: (spaceId: string) => void;
	updateSpace: (spaceId: string, space: Partial<Space>) => void;
	spacesToArray: () => Space[];
}

type CreateSpaceSlice = StateCreator<SpaceSlice>;

export const createSpaceSliece: CreateSpaceSlice = (set, get: any) => ({
	spaces: {},
	addSpace: (space: Space) => {
		if (space.workSpaceId in get().workspaces) {
			set((state: any) => ({ spaces: { ...state.spaces, [space.id]: space } }));
		}
	},
	deleteSpace: (spaceId: string) =>
		set((state: any) => {
			const { [spaceId]: deleted, ...spaces } = state.spaces;
			return { spaces };
		}),
	updateSpace: (spaceId: string, space: Partial<Space>) => {
		if (spaceId in get().spaces) {
			set((state: any) => ({
				spaces: {
					...state.spaces,
					[spaceId]: { ...state.spaces[spaceId], ...space },
				},
			}));
		}
	},
	spacesToArray: () => Object.values(get().spaces),
});
