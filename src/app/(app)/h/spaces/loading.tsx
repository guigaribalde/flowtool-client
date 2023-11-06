export default function Loading() {
	return (
		<div className="flex w-full flex-col">
			<h1 className="text-xl font-semibold text-slate-700">Seus espacos</h1>
			<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				<div className="duration-600 h-24 w-full animate-pulse cursor-pointer rounded-lg bg-slate-300 p-3 transition-all " />
				<div className="duration-600 h-24 w-full animate-pulse cursor-pointer rounded-lg bg-slate-300 p-3 transition-all " />
				<div className="duration-600 h-24 w-full animate-pulse cursor-pointer rounded-lg bg-slate-300 p-3 transition-all " />
				<div className="duration-600 h-24 w-full animate-pulse cursor-pointer rounded-lg bg-slate-300 p-3 transition-all " />
				<div className="duration-600 h-24 w-full animate-pulse cursor-pointer rounded-lg bg-slate-300 p-3 transition-all " />
			</div>
		</div>
	);
}
