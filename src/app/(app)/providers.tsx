'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { useEffect, useState } from 'react';
import {
	InitialData,
	useAppMetadata,
} from '@/stores/app-metadata/app-metadata';

export function Providers({
	children,
	initialData,
}: {
	children: React.ReactNode;
	initialData: InitialData;
}) {
	const build = useAppMetadata((state) => state.build);
	useEffect(() => {
		build(initialData);
	}, []);

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
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
}
