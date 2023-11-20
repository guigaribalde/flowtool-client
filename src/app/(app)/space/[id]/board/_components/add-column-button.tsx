/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-autofocus */

import { useState, useRef, useContext } from 'react';
import { PiCheckBold, PiPlusBold, PiXBold } from 'react-icons/pi';
import { useOnClickOutside } from 'usehooks-ts';
import { ObjectId } from '@/utils/utils';
import SocketContext from '@/utils/contexts/SocketContext/Context';
import useBoard from '../_utils/hooks/useBoard';

interface AddColumnButtonProps {
	spaceId: string;
}

export default function AddColumnButton({ spaceId }: AddColumnButtonProps) {
	const [isAddingColumn, setIsAddingColumn] = useState(false);
	const { SocketState, SocketDispatch } = useContext(SocketContext);
	const ref = useRef<HTMLFormElement>(null);

	const { query, createColumn } = useBoard();
	const columns = query.data?.columns || [];

	const handleClose = () => {
		setIsAddingColumn(false);
	};

	const handleAddColumn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// @ts-ignore
		const name = e.currentTarget.name.value;

		const payload = {
			id: ObjectId(),
			name,
			index: columns.length,
			tasks: [],
		};

		createColumn(payload);
		setIsAddingColumn(false);

		// createColumn.mutate({
		// 	...payload,
		// 	spaceId,
		// });
	};

	useOnClickOutside(ref, () => {
		handleClose();
	});

	return isAddingColumn ? (
		<div className="flex h-full w-[320px] flex-col gap-6">
			<form
				onSubmit={handleAddColumn}
				ref={ref}
				className="flex items-center justify-between rounded-lg border-[1px] border-slate-200 bg-white px-4 py-2 shadow-md"
			>
				<h3 className="flex items-center gap-1 text-sm font-medium">
					<input
						className="border-transparent outline-none focus:border-transparent focus:outline-none focus:ring-0"
						name="name"
						placeholder="Digite o nome da coluna"
						autoFocus
					/>
				</h3>
				<div className="flex items-center gap-1">
					<button
						onClick={handleClose}
						type="button"
						className="btn btn-primary btn-ghost btn-outline btn-sm px-2"
					>
						<PiXBold />
					</button>

					<button type="submit" className="btn btn-primary btn-sm px-2">
						<PiCheckBold />
					</button>
				</div>
			</form>
		</div>
	) : (
		<div className="flex h-full w-[320px] flex-col gap-6">
			<button
				type="button"
				className="btn btn-ghost flex h-[50px] items-center justify-between rounded-lg px-4 py-2 normal-case"
				onClick={() => setIsAddingColumn(true)}
			>
				<h3 className="flex items-center gap-2 text-sm font-medium">
					<PiPlusBold />
					Adicionar coluna
				</h3>
			</button>
		</div>
	);
}
