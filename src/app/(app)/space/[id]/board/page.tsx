/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-autofocus */

'use client';

import { BoardColumn } from '@components/core/board-column';
import { Card } from '@components/core/card';
import { Dispatch, SetStateAction, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { v4 } from 'uuid';

import { PiCheckBold, PiPlusBold, PiXBold } from 'react-icons/pi';

const CARDS = [
	{
		id: '1',
		title: 'Card 1',
	},
	{
		id: '2',
		title: 'Card 2',
	},
	{
		id: '3',
		title: 'Card 3',
	},
	{
		id: '4',
		title: 'Card 4',
	},
	{
		id: '5',
		title: 'Card 5',
	},
	{
		id: '6',
		title: 'Card 6',
	},
	{
		id: '7',
		title: 'Card 7',
	},
	{
		id: '8',
		title: 'Card 8',
	},
	{
		id: '9',
		title: 'Card 9',
	},
	{
		id: '10',
		title: 'Card 10',
	},
	{
		id: '11',
		title: 'Card 11',
	},
	{
		id: '12',
		title: 'Card 12',
	},
];

const COLUMNS = [
	{
		id: '1',
		name: 'Etapa 1',
		items: CARDS,
	},
	{
		id: '2',
		name: 'Etapa 2',
		items: [],
	},
];

type PageParams = {
	params: {
		id: string;
	};
};

type Columns = {
	id: string;
	name: string;
	items: {
		id: string;
		title: string;
	}[];
}[];

const onDragEnd = (
	result: DropResult,
	columns: Columns,
	setColumns: Dispatch<SetStateAction<Columns>>,
) => {
	if (!result.destination) return;
	const { source, destination } = result;

	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns.find(({ id }) => id === source.droppableId);
		const destColumn = columns.find(({ id }) => id === destination.droppableId);
		const sourceItems = sourceColumn?.items ? [...sourceColumn.items] : [];
		const destItems = destColumn?.items ? [...destColumn.items] : [];
		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);
		setColumns(
			columns.map((column) => {
				if (column.id === source.droppableId) {
					return {
						...column,
						items: sourceItems,
					};
				}
				if (column.id === destination.droppableId) {
					return {
						...column,
						items: destItems,
					};
				}
				return column;
			}),
		);
	} else {
		const column = columns.find(({ id }) => id === source.droppableId);
		const copiedItems = column?.items ? [...column.items] : [];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		setColumns(
			columns.map((inner_collumn) => {
				if (inner_collumn.id === source.droppableId) {
					return {
						...inner_collumn,
						items: copiedItems,
					};
				}
				return inner_collumn;
			}),
		);
	}
};

export default function Page({ params }: PageParams) {
	console.log(params.id);
	const [columns, setColumns] = useState(COLUMNS);

	const [addColumn, setAddColumn] = useState(false);
	const handleAddColumn = (e: any) => {
		e.preventDefault();
		setAddColumn(false);

		setColumns([
			...columns,
			{
				id: v4(),
				name: e.target.name.value,
				items: [],
			},
		]);
	};

	return (
		<div className="h-full w-full overflow-x-auto bg-gray-100">
			<div className="flex h-full min-w-fit gap-6 px-9 pt-8">
				<DragDropContext
					onDragEnd={(result) => {
						onDragEnd(result, columns, setColumns);
					}}
				>
					{columns.map(({ id, name, items }) => (
						<BoardColumn key={id} id={id} name={name}>
							{items.map((card, item_index) => (
								<Card
									key={card.id}
									id={card.id}
									index={item_index}
									title={card.title}
								/>
							))}
						</BoardColumn>
					))}
				</DragDropContext>

				{addColumn ? (
					<form
						onSubmit={handleAddColumn}
						className="flex h-full w-[320px] flex-col gap-4"
					>
						<div className="flex w-full items-center justify-between rounded-lg border-[1px] border-slate-200 bg-white px-4 py-2 shadow-md">
							<input
								name="name"
								className="w-52 border-none text-sm font-medium focus:border-none"
								autoFocus
							/>
							<div className="flex items-center gap-1 text-slate-500">
								<button type="submit" className="btn btn-ghost btn-sm px-2">
									<PiCheckBold />
								</button>
								<button
									onClick={() => setAddColumn(false)}
									type="button"
									className="btn btn-ghost btn-sm px-2"
								>
									<PiXBold />
								</button>
							</div>
						</div>
					</form>
				) : (
					<div
						className="flex h-full w-[320px] flex-col gap-4"
						onClick={() => setAddColumn(true)}
					>
						<div className="flex h-[50px] cursor-pointer items-center justify-between rounded-lg border-[1px] border-slate-300 px-4 py-2 transition-all hover:bg-white/50">
							<h3 className="flex items-center gap-1 text-sm font-medium">
								<PiPlusBold />
								Adicionar coluna
							</h3>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
