'use client';

import {
	resetServerContext,
	DragDropContext,
	DropResult,
} from 'react-beautiful-dnd';
import { BoardColumn } from '@components/core/board-column';
import { Card } from '@components/core/card';
import { Dispatch, SetStateAction, useState } from 'react';
import AddColumnButton from './add-column-button';
import { TBoard, TColumn } from '../_utils/context/BoardContext';
import useBoard from '../_utils/hooks/useBoard';

function onDragEnd(result: DropResult, columns: TColumn[]): TColumn[] | null {
	if (!result.destination) return null;
	const { source, destination } = result;

	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns.find(({ id }) => id === source.droppableId);
		const destColumn = columns.find(({ id }) => id === destination.droppableId);
		const sourceItems = sourceColumn?.tasks ? [...sourceColumn.tasks] : [];
		const destItems = destColumn?.tasks ? [...destColumn.tasks] : [];
		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);

		const newColumns = columns.map((column) => {
			if (column.id === source.droppableId) {
				return {
					...column,
					tasks: sourceItems,
				};
			}
			if (column.id === destination.droppableId) {
				return {
					...column,
					tasks: destItems,
				};
			}
			return column;
		});

		return newColumns;
	}

	const column = columns.find(({ id }) => id === source.droppableId);
	const copiedItems = column?.tasks ? [...column.tasks] : [];
	const [removed] = copiedItems.splice(source.index, 1);
	copiedItems.splice(destination.index, 0, removed);
	const newColumns = columns.map((inner_collumn) => {
		if (inner_collumn.id === source.droppableId) {
			return {
				...inner_collumn,
				tasks: copiedItems,
			};
		}
		return inner_collumn;
	});

	return newColumns;
}

interface BoardProps {
	spaceId: string;
}

export default function Board({ spaceId }: BoardProps) {
	resetServerContext();
	const { query, setColumns, updateTasksOrder, updateTasksColumn } = useBoard();
	const columns = query.data?.columns || [];

	return (
		<>
			<DragDropContext
				onDragEnd={(result) => {
					console.log(result);
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
						console.log('move task to another column');
						updateTasksColumn.mutate({ source, destination, taskId });
						return null;
					}

					// move task inside the same column
					updateTasksOrder.mutate({ source, destination, taskId });
					console.log('move task inside the same column');
					return null;
				}}
			>
				{columns?.length
					? columns.map(({ id, name, tasks }) => (
							<BoardColumn key={id} id={id} name={name}>
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
