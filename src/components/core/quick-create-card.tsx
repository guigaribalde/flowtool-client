/* eslint-disable jsx-a11y/no-autofocus */
import useBoard from '@/app/(app)/space/[id]/board/_utils/hooks/useBoard';
import { ObjectId } from '@/utils/utils';
import { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface QuickCreateCardProps {
	setFalse: () => void;
	columnId: string;
}

export default function QuickCreateCard({
	setFalse,
	columnId,
}: QuickCreateCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { createTask, query } = useBoard();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		// @ts-ignore
		const name = e.currentTarget.name.value;

		const index =
			query.data?.columns.find((c) => c.id === columnId)?.tasks.length || 0;

		const payload = {
			name,
			columnId,
			id: ObjectId(),
			index,
		};

		createTask.mutate(payload);
		setFalse();
	};

	useOnClickOutside(ref, setFalse);
	return (
		<div
			ref={ref}
			className="mb-2 flex-shrink-0 rounded-lg border-[1px] border-slate-200 bg-white px-3 py-3 shadow-md"
		>
			<form
				onSubmit={handleSubmit}
				className="flex h-full w-full flex-col gap-5"
			>
				<span className="text-sm font-medium">
					<input
						className="border-transparent outline-none focus:border-transparent focus:outline-none focus:ring-0"
						placeholder="Digite o nome da tarefa"
						name="name"
						autoFocus
					/>
				</span>

				<div className="flex justify-end gap-2">
					<button className="btn btn-primary btn-outline btn-sm" type="button">
						Cancelar
					</button>
					<button className="btn btn-primary btn-sm" type="submit">
						Salvar
					</button>
				</div>
			</form>
		</div>
	);
}
