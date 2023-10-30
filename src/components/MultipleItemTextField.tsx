import { useState } from 'react';
import { PiPlus, PiX } from 'react-icons/pi';
import * as Yup from 'yup';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string | boolean;
	value: string[];
	name: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const schema = Yup.object().shape({
	email: Yup.string().email().required(),
});

export default function MultipleItemTextField({
	error = '',
	label,
	value,
	name,
	onChange,
	...rest
}: InputProps) {
	const [email, setEmail] = useState<string>('');
	const [innerError, setInnerError] = useState<string>('');

	const removeEmail = (em: string) => {
		onChange({
			target: {
				name,
				value: value.filter((e) => e !== em),
			},
		} as any);
	};

	const addEmail = () => {
		if (value.includes(email)) {
			setInnerError('Email já adicionado');
			return;
		}
		if (!schema.isValidSync({ email })) {
			setInnerError('Email inválido');
			return;
		}
		onChange({
			target: {
				name,
				value: [...value, email],
			},
		} as any);
		setEmail('');
	};

	const hasError = !!error || !!innerError;
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<label className="input-group">
				<input
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...rest}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onKeyDown={(e) => {
						setInnerError('');
						if (e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') {
							e.preventDefault();
							addEmail();
						}
					}}
					className={`input input-bordered w-full ${
						hasError ? 'input-error' : ''
					} ${rest.className || ''}`}
				/>
				<button
					type="button"
					className="btn btn-square border border-l-0 border-gray-300 hover:border-gray-300 active:border-gray-300"
					onClick={addEmail}
				>
					<PiPlus className="text-xl" />
				</button>
			</label>
			{hasError ? (
				<label className="label">
					<span className="label-text-alt text-error">
						{error || innerError}
					</span>
				</label>
			) : null}
			<div className="mt-2 flex w-full flex-wrap gap-2">
				{value.map((em) => (
					<div key={em} className="badge badge-primary gap-2">
						<PiX onClick={() => removeEmail(em)} className="cursor-pointer" />
						{em}
					</div>
				))}
			</div>
		</div>
	);
}
