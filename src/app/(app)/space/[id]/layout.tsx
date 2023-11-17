/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import Tabs from '@components/core/tabs';
import { PiGearFill, PiTriangleFill } from 'react-icons/pi';
import { usePathname } from 'next/navigation';

type LayoutParams = {
	params: {
		id: string;
	};
	children: React.ReactNode;
};
export default function Layout({ children, params }: LayoutParams) {
	const pathname = usePathname();
	const activeTab = pathname.split('/').pop();

	const transformTabName = (name: string | undefined) => {
		if (!name) return 'Quadro';

		if (name === 'canvas') return 'Canvas';
		if (name === 'notes') return 'Notas';
		if (name === 'board') return 'Quadro';

		return 'Quadro';
	};

	return (
		<>
			<div className="flex w-full items-center justify-between border-b border-b-slate-300 px-6 py-2">
				<div className="flex min-w-[300px] items-center">
					<p className="flex items-center gap-4 text-slate-800">
						<PiTriangleFill />
						<span className="text-sm">
							Workspace / Space / {transformTabName(activeTab)}
						</span>
					</p>
				</div>
				<Tabs>
					<Tabs.Tab href={`/space/${params.id}/board`} name="Quadro" />
					<Tabs.Tab href={`/space/${params.id}/notes`} name="Notas" />
					<Tabs.Tab href={`/space/${params.id}/canvas`} name="Canvas" />
				</Tabs>
				<div className="flex min-w-[300px] items-center justify-end gap-3">
					<button className="btn btn-primary btn-sm" type="button">
						Criar tarefa
					</button>
					<button className="btn btn-ghost btn-sm" type="button">
						<PiGearFill className="text-xl" />
					</button>
				</div>
			</div>
			{children}
		</>
	);
}
