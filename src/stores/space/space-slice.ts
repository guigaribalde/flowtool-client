import { Space } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface SpaceSlice {
	space: Space;
	updateSpace: (spaceId: string, space: Partial<Space>) => void;
}

type CreateSpaceSlice = StateCreator<SpaceSlice>;

export const createSpaceSliece: CreateSpaceSlice = (set, get: any) => ({
	space: {} as Space,
	updateSpace: (space: Partial<Space>) => {
		set((state: any) => ({
			space: {
				...state.space,
				...space,
			},
		}));
	},
});
