'use client';

import { useAppMetadata } from '@/stores/app-metadata/app-metadata';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type PageParams = {
	params: {
		id: string;
	};
};
export default function Page({ params }: PageParams) {
	const router = useRouter();
	const deleteWorkspace = useAppMetadata((state) => state.deleteWorkspace);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		router.push('/h/spaces');
		axios.delete('/api/workspace', { data: { id: params.id } });
		deleteWorkspace(params.id);
	};
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h1 className="text-xl font-semibold text-slate-700">Configurações</h1>
			<div className="flex flex-col gap-3 text-2xl">
				<button type="submit" className="btn btn-primary btn-sm">
					Deletar Area de Trabalho
				</button>
			</div>
		</form>
	);
}
