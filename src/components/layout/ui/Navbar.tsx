import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
	return (
		<div className="w-full border-b border-b-slate-300 bg-slate-50 px-6 py-2">
			<div className="mx-auto flex items-center justify-between">
				<div className="flex items-center gap-5">
					<span className="mr-5 text-lg font-semibold">Flow Tool</span>
				</div>
				<div className="flex items-center gap-5">
					<span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
						<div className="h-full w-full animate-pulse bg-slate-300" />
						<UserButton afterSignOutUrl="/" />
					</span>
				</div>
			</div>
		</div>
	);
}
