function debounce<Params extends any[]>(
	func: (...args: Params) => any,
	timeout: number,
): (...args: Params) => void {
	let timer: NodeJS.Timeout;
	return (...args: Params) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}
const ObjectId = (
	m = Math,
	d = Date,
	h = 16,
	s = (i: any) => m.floor(i).toString(h),
) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

export { debounce, ObjectId };
