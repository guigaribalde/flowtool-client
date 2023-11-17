type PageParams = {
	params: {
		id: string;
	};
};
export default function Page({ params }: PageParams) {
	console.log(params.id);
	return <div>Page</div>;
}
