import { Space, UserOnWorkSpace, WorkSpace } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface WorkspaceSlice {
	workspaces: Record<string, WorkSpace>;
	addWorkspace: (workspace: WorkSpace) => void;
	deleteWorkspace: (workspaceId: string) => void;
	updateSpace: (workspaceId: string, workspace: Partial<WorkSpace>) => void;
	workspacesToArray: () => WorkSpace[];
}

type CreateWorkspaceSlice = StateCreator<WorkspaceSlice>;

export const createWorkspaceSliece: CreateWorkspaceSlice = (set, get) => ({
	workspaces: {},
	addWorkspace: (workspace: WorkSpace) => {
		set((state: any) => ({
			workspaces: { ...state.workspaces, [workspace.id]: workspace },
		}));
	},
	deleteWorkspace: (workspaceId: string) =>
		set((state: any) => {
			const { [workspaceId]: deleted, ...workspaces } = state.workspaces;
			const spacesArray = state
				.spacesToArray()
				.filter((space: Space) => space.workSpaceId !== workspaceId);

			const userOnWorkspaceArray = state
				.userOnWorkSpacesToArray()
				.filter(
					(userOnWorkspace: UserOnWorkSpace) =>
						userOnWorkspace.workSpaceId !== workspaceId,
				);

			const spaces: Record<string, Space> = {};
			const userOnWorkSpaces: Record<string, UserOnWorkSpace> = {};

			spacesArray.forEach((s: Space) => {
				spaces[s.id] = s;
			});

			userOnWorkspaceArray.forEach((u: UserOnWorkSpace) => {
				userOnWorkSpaces[u.id] = u;
			});

			return { workspaces, spaces, userOnWorkSpaces };
		}),
	updateSpace: (workspaceId: string, workspace: Partial<WorkSpace>) => {
		if (workspaceId in get().workspaces) {
			set((state: any) => ({
				workspaces: {
					...state.workspaces,
					[workspaceId]: { ...state.workspaces[workspaceId], ...workspace },
				},
			}));
		}
	},
	workspacesToArray: () => Object.values(get().workspaces),
});
