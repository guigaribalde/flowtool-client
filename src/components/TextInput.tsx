interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string | boolean;
}

export default function TextInput({ label, error = '', ...rest }: InputProps) {
	const hasError = !!error;
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<input
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				className={`input input-bordered ${
					hasError ? 'input-error' : ''
				} w-full ${rest.className || ''}`}
			/>
			{hasError ? (
				<label className="label">
					<span className="label-text-alt text-error">{error}</span>
				</label>
			) : null}
		</div>
	);
}
