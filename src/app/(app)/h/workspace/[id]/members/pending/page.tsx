type PageParams = {
	params: {
		id: string;
	};
};
export default function Page({ params }: PageParams) {
	console.log(params);
	return (
		<div>
			<span>null</span>
		</div>
	);
}
