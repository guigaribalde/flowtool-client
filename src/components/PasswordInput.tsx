import { useState } from 'react';
import { PiEye, PiEyeClosed } from 'react-icons/pi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string | boolean;
}

export default function PasswordInput({
	label,
	error = '',
	...rest
}: InputProps) {
	const [showPassowrd, setShowPassword] = useState(false);
	const hasError = !!error;
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<label className="input-group">
				<input
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...rest}
					className={`input input-bordered ${
						hasError ? 'input-error' : ''
					} w-full ${rest.className || ''}`}
					type={showPassowrd ? 'text' : 'password'}
				/>
				<button
					type="button"
					className="btn btn-square border border-l-0 border-gray-300 hover:border-gray-300 active:border-gray-300"
					onClick={() => setShowPassword(!showPassowrd)}
				>
					{showPassowrd ? (
						<PiEye className="text-xl" />
					) : (
						<PiEyeClosed className="text-xl" />
					)}
				</button>
			</label>
			{hasError ? (
				<label className="label">
					<span className="label-text-alt text-error">{error}</span>
				</label>
			) : null}
		</div>
	);
}
