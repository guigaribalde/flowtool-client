/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { Droppable } from 'react-beautiful-dnd';
import { PiDotsThreeOutlineFill, PiPlusBold } from 'react-icons/pi';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoolean } from 'usehooks-ts';
import QuickCreateCard from './quick-create-card';

interface BoardColumnProps {
	children: React.ReactNode;
	id: string;
	name: string;
}

export function BoardColumn({ children, id, name }: BoardColumnProps) {
	const { value, setTrue, setFalse, toggle } = useBoolean(false);

	return (
		<div className="flex h-full w-[320px] flex-col gap-6">
			<div className="flex items-center justify-between rounded-lg border-[1px] border-slate-200 bg-white px-4 py-2 shadow-md">
				<h3 className="flex items-center gap-1 text-sm font-medium">{name}</h3>
				<div className="flex items-center gap-1 text-slate-500">
					<button
						onClick={setTrue}
						type="button"
						className="btn btn-ghost btn-sm px-2"
					>
						<PiPlusBold />
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<PiDotsThreeOutlineFill />
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="end">
							<DropdownMenuItem
								onClick={() => {}}
								className="flex cursor-pointer items-center gap-2"
							>
								<span>Sair</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<Droppable droppableId={id}>
				{(provided, snapshot) => {
					return (
						<div
							className="relative mb-4 flex h-full w-full flex-col overflow-y-auto rounded-lg p-1"
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={{
								border: snapshot.isDraggingOver
									? '1px dashed rgba(203, 213, 225, 1)'
									: '1px solid rgba(0, 0, 0, 0)',
							}}
						>
							{children}
							{value && <QuickCreateCard columnId={id} setFalse={setFalse} />}
						</div>
					);
				}}
			</Droppable>
		</div>
	);
}
