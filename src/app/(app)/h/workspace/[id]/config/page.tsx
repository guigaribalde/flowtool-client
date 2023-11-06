type PageParams = {
	params: {
		id: string;
	};
};
export default function Page({ params }: PageParams) {
	return (
		<div>
			<span>{decodeURI(params.id)}</span>
		</div>
	);
}
