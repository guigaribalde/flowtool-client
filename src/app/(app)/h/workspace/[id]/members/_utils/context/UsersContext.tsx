/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { $Enums } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import {
	type UseQueryResult,
	useQuery,
	useMutation,
	UseMutationResult,
	useQueryClient,
} from '@tanstack/react-query';
import { createContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export type User = {
	id: string;
	userRole: $Enums.UserRole;
	email?: string | undefined;
	username?: string | undefined;
	status?: $Enums.Status | null | undefined;
	inviteStatus: $Enums.InviteStatus;
	invitedUserEmail: string | null;
};

type OldData = { users: User[] };

export interface UsersContextState {
	query: UseQueryResult<{ users: User[] }, Error>;
	inviteMembersMutation: UseMutationResult<
		AxiosResponse<any, any>,
		Error,
		{
			email: string;
		},
		unknown
	>;
	deleteInvitationMutation: UseMutationResult<
		AxiosResponse<any, any>,
		Error,
		{
			userId: string;
		},
		unknown
	>;
}

const UsersContext = createContext<UsersContextState>({} as UsersContextState);

async function getUsers(workspaceId: string) {
	const { data } = await axios.get(`/api/workspace/${workspaceId}/members`);
	return data;
}

export default function UsersContextProvider({
	children,
	workspaceId,
}: {
	children: React.ReactNode;
	workspaceId: string;
}) {
	const [queryData, setQueryData] = useState<{ [key: string]: any }>({});
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ['members', workspaceId],
		queryFn: () => getUsers(workspaceId),
	});

	const inviteMembersMutation = useMutation({
		mutationFn: async (values: { email: string }) => {
			return axios.post(`/api/workspace/${workspaceId}/invite`, values);
		},
		onSuccess: ({ data }) => {
			const { invitedUser } = data as { invitedUser: User };

			queryClient.setQueryData(['members', workspaceId], (oldData: OldData) => {
				const newData = {
					...oldData,
					users: [...oldData.users, invitedUser],
				};
				return newData;
			});
		},
	});

	const deleteInvitationMutation = useMutation({
		mutationFn: async (values: { userId: string }) => {
			return axios.delete(`/api/workspace/${workspaceId}/invite`, {
				data: values,
			});
		},
		onMutate: async ({ userId }) => {
			const temp = queryClient.getQueryData(['members', workspaceId]) as {
				users: User[];
			};
			const removedUser = temp.users.find((user) => user.id === userId);

			setQueryData((old) => {
				return {
					...old,
					[userId]: removedUser,
				};
			});

			queryClient.setQueryData(['members', workspaceId], (oldData: OldData) => {
				const newData = {
					...oldData,
					users: oldData.users.filter((user) => user.id !== userId),
				};
				return newData;
			});
		},
		onError: (error, { userId }) => {
			const removedUser = queryData[userId];
			queryClient.setQueryData(['members', workspaceId], (oldData: OldData) => {
				const newData = {
					...oldData,
					users: [...oldData.users, removedUser],
				};
				return newData;
			});
			setQueryData((old) => {
				const copy = { ...old };
				delete copy[userId];
				return {
					...copy,
				};
			});

			console.log(error);
			toast({
				title: 'Erro',
				description: 'Ocorreu um erro ao remover usuário',
				variant: 'destructive',
			});
		},
		onSuccess: (_, { userId }) => {
			setQueryData((old) => {
				const copy = { ...old };
				delete copy[userId];
				return {
					...copy,
				};
			});
		},
	});

	return (
		<UsersContext.Provider
			value={{ query, inviteMembersMutation, deleteInvitationMutation }}
		>
			{children}
		</UsersContext.Provider>
	);
}
export { UsersContext };
