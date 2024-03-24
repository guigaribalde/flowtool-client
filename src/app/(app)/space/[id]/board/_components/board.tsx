'use client';

import { resetServerContext, DragDropContext } from 'react-beautiful-dnd';
import { BoardColumn } from '@components/core/board-column';
import { Card } from '@components/core/card';
import AddColumnButton from './add-column-button';
import useBoard from '../_utils/hooks/useBoard';

interface BoardProps {
	spaceId: string;
}

export default function Board({ spaceId }: BoardProps) {
	resetServerContext();
	const { board, updateTasksOrder, updateTasksColumn } = useBoard();
	const columns = board?.columns || [];

	return (
		<>
			<DragDropContext
				onDragEnd={(result) => {
					if (!result.destination) return null;
					const {
						source: dndSource,
						destination: dndDestination,
						draggableId: taskId,
					} = result;

					const source = {
						columnId: dndSource.droppableId,
						taskIndex: dndSource.index,
					};

					const destination = {
						columnId: dndDestination!.droppableId,
						taskIndex: dndDestination!.index,
					};

					// move task to another column
					if (source.columnId !== destination.columnId) {
						updateTasksColumn({ source, destination, taskId });
						return null;
					}

					// move task inside the same column
					updateTasksOrder({ source, destination, taskId });
					return null;
				}}
			>
				{columns?.length
					? columns.map(({ id, name, tasks, index }) => (
							<BoardColumn
								key={id}
								id={id}
								index={index}
								size={columns.length}
								name={name}
							>
								{tasks.map((card, item_index) => (
									<Card
										key={card.id}
										id={card.id}
										index={item_index}
										title={card.name}
									/>
								))}
							</BoardColumn>
					  ))
					: null}
			</DragDropContext>
			<AddColumnButton spaceId={spaceId} />
		</>
	);
}
