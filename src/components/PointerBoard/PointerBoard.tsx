'use client';

import useUserPointer from '@/utils/contexts/UserPointerContext/useUserPointerContext';
import { PiNavigationArrowFill } from 'react-icons/pi';

export default function PointerBoardComponent() {
	const { pointers } = useUserPointer();
	return (
		<div className="absolute bottom-0 left-0 right-0 top-0">
			{Object.entries(pointers).map(([uid, position]) => {
				return (
					<div
						className="absolute flex"
						style={{
							left: position.x,
							top: position.y,
							transform: 'translate(0%, 0%)',
						}}
						key={uid}
					>
						<PiNavigationArrowFill className="text-xl text-red-400" />
						<span className="bottom-0 left-0 -ml-1 mt-3 rounded-full bg-red-400 px-2.5 py-2 text-xs font-medium text-white">
							{uid}
						</span>
					</div>
				);
			})}
		</div>
	);
}
