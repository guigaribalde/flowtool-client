import { PiEye, PiEyeClosed } from 'react-icons/pi';
import { useBoolean } from 'usehooks-ts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	formik: any;
	name: string;
}

export default function PasswordInput({
	label,
	formik,
	name,
	...rest
}: InputProps) {
	const { value, toggle } = useBoolean(false);
	const error = formik.touched[name] && formik.errors[name];

	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<label className="input-group">
				<input
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...rest}
					name={name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values[name]}
					className={`input input-bordered ${
						error ? 'input-error' : ''
					} w-full ${rest.className || ''}`}
					type={value ? 'text' : 'password'}
				/>
				<button
					type="button"
					className="btn btn-square border border-l-0 border-gray-300 hover:border-gray-300 active:border-gray-300"
					onClick={toggle}
				>
					{value ? (
						<PiEye className="text-xl" />
					) : (
						<PiEyeClosed className="text-xl" />
					)}
				</button>
			</label>
			{error ? (
				<label className="label">
					<span className="label-text-alt text-error">{error}</span>
				</label>
			) : null}
		</div>
	);
}
