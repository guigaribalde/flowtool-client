/* eslint-disable react/jsx-props-no-spreading */

'use client';

import useBoard from '@/app/(app)/space/[id]/board/_utils/hooks/useBoard';
import { debounce } from '@/utils/utils';
import {
	Draggable,
	DraggingStyle,
	NotDraggingStyle,
} from 'react-beautiful-dnd';

interface CardProps {
	id: string;
	title: string;
	index: number;
}

export function Card({ id, title, index }: CardProps) {
	// const { moveTask, taskMoveEvent, moveEndTask, clientMovingTask } = useBoard();
	// const deboucedMoveTask = debounce(moveTask, 1);

	// if (taskMoveEvent.taskId === id) {
	// 	return (
	// 		<div
	// 			className="mb-2 flex-shrink-0 rounded-lg border-[1px] border-slate-200 bg-white px-2 py-3 shadow-md"
	// 			style={{
	// 				...taskMoveEvent.style,
	// 			}}
	// 		>
	// 			<span className="text-sm font-medium">{title}</span>
	// 		</div>
	// 	);
	// }

	return (
		<Draggable draggableId={id} index={index}>
			{(provided, { isDragging }) => {
				const style = provided.draggableProps.style as
					| DraggingStyle
					| NotDraggingStyle
					| undefined;
				// if (isDragging) {
				// 	deboucedMoveTask({ style, taskId: id });
				// }
				//
				// if (!isDragging && clientMovingTask === id) {
				// 	moveEndTask({ taskId: id });
				// }

				return (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className="mb-2 flex-shrink-0 rounded-lg border-[1px] border-slate-200 bg-white px-2 py-3 shadow-md"
						style={{
							...style,
							opacity: isDragging ? 0.6 : 1,
						}}
					>
						<span className="text-sm font-medium">{title}</span>
					</div>
				);
			}}
		</Draggable>
	);
}
