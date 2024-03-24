import { create } from 'zustand';
import {
	Prisma,
	UserOnWorkSpace as TUserOnWorkSpace,
	WorkSpace as TWorkSpace,
	Space as TSpace,
} from '@prisma/client';
import { createSpaceSliece, type SpaceSlice } from './space-slice';
import { createWorkspaceSliece, type WorkspaceSlice } from './workspace-slice';
import {
	createUserOnWorkSpaceSliece,
	type UserOnWorkspaceSlice,
} from './useronworkspace-slice';
import { createUserSliece, type UserSlice } from './user-slice';

export type InitialData = Prisma.UserGetPayload<{
	include: {
		UserOnWorkSpace: {
			include: {
				workSpace: {
					include: { Space: true };
				};
			};
		};
	};
}>;

type AppMetadata = SpaceSlice &
	WorkspaceSlice &
	UserOnWorkspaceSlice &
	UserSlice & {
		build: (initialData: InitialData) => void;
	};

export const useAppMetadata = create<AppMetadata>()((...args) => {
	return {
		...createSpaceSliece(...args),
		...createWorkspaceSliece(...args),
		...createUserOnWorkSpaceSliece(...args),
		...createUserSliece(...args),
		build: (initialData: InitialData) => {
			const [set] = args;
			const { UserOnWorkSpace, ...user } = initialData;

			set(() => {
				const userOnWorkSpaces: Record<string, TUserOnWorkSpace> = {};
				const workspaces: Record<string, TWorkSpace> = {};
				const spaces: Record<string, TSpace> = {};

				UserOnWorkSpace.forEach((userOnWorkspace) => {
					const { workSpace, ...userOnWorkSpace } = userOnWorkspace;
					userOnWorkSpaces[userOnWorkspace.workSpaceId] = userOnWorkSpace;

					const { Space, ...workSpaceData } = workSpace;
					workspaces[workSpace.id] = workSpaceData;

					Space.forEach((space) => {
						spaces[space.id] = space;
					});
				});

				return {
					user,
					userOnWorkSpaces,
					workspaces,
					spaces,
				};
			});
		},
	};
});
