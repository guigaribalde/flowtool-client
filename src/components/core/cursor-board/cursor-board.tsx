'use client';

import { Cursor as TCursor } from '@/utils/contexts/UserPointerContext/UserPointerContext';
import useUserPointer from '@/utils/contexts/UserPointerContext/useUserPointerContext';
import {
	PiNavigationArrowFill,
	PiNavigationArrowDuotone,
	PiHandGrabbingFill,
	PiHandPointingFill,
	PiPencilFill,
	PiPencilSimpleFill,
} from 'react-icons/pi';

function Cursor({ cursor }: { cursor: TCursor }) {
	if (cursor.buttons === 5)
		return (
			<PiPencilSimpleFill className="animate-bounce text-xl text-red-400" />
		);
	if (cursor.draggableId && cursor.buttons === 1)
		return <PiHandGrabbingFill className="text-xl text-red-400" />;

	if (cursor.draggableId && cursor.buttons === 0)
		return <PiHandPointingFill className="text-xl text-red-400" />;

	return <PiNavigationArrowFill className="text-xl text-red-400" />;
}

export default function PointerBoardComponent() {
	const { pointers } = useUserPointer();
	return (
		<div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 overflow-hidden">
			{Object.entries(pointers).map(([uid, cursor]) => {
				return (
					<div
						className="absolute flex"
						style={{
							left: cursor.x,
							top: cursor.y,
							transform: 'translate(-2%, 0%)',
							zIndex: 9999,
						}}
						key={uid}
					>
						<Cursor cursor={cursor} />
						<span className="bottom-0 left-0 -ml-1 mt-3 rounded-full bg-red-400 px-2.5 py-2 text-xs font-medium capitalize text-white">
							{cursor.name}
						</span>
					</div>
				);
			})}
		</div>
	);
}
