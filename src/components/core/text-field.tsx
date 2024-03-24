interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	formik: any;
	name: string;
}

export default function TextInput({
	label,
	formik,
	name,
	...rest
}: InputProps) {
	const error = formik.touched[name] && formik.errors[name];
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<input
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				name={name}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values[name]}
				className={`input input-bordered ${error ? 'input-error' : ''} w-full ${
					rest.className || ''
				}`}
			/>
			{error ? (
				<label className="label">
					<span className="label-text-alt text-error">{error}</span>
				</label>
			) : null}
		</div>
	);
}
