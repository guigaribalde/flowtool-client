'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { useState } from 'react';
import CurrentUserContextProvider, {
	TUser,
} from './_utils/context/CurrentUserContext';

export function Providers({
	children,
	currentUser,
}: {
	children: React.ReactNode;
	currentUser: TUser;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 1000,
					},
				},
			}),
	);

	return (
		<CurrentUserContextProvider currentUser={currentUser}>
			<QueryClientProvider client={queryClient}>
				<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
			</QueryClientProvider>
		</CurrentUserContextProvider>
	);
}
