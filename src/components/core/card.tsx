/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { Draggable } from 'react-beautiful-dnd';

interface CardProps {
	id: string;
	title: string;
	index: number;
}

export function Card({ id, title, index }: CardProps) {
	return (
		<Draggable draggableId={id} index={index}>
			{(provided) => {
				return (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className="mb-2 flex-shrink-0 rounded-lg border-[1px] border-slate-200 bg-white px-2 py-3 shadow-md"
						style={{
							...provided.draggableProps.style,
						}}
					>
						<span className="text-sm font-medium">{title}</span>
					</div>
				);
			}}
		</Draggable>
	);
}
