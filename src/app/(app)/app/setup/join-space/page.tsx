'use client';

import TextInput from '@components/forms/TextInput';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	ownerEmail: Yup.string().required('Email do administrador e obrigatorio'),
});

export default function Page() {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			ownerEmail: '',
		},
		validationSchema,
		onSubmit: (values) => {
			console.log(values);
		},
	});

	const createSpace = () => {
		return router.push('/app/setup');
	};

	const ownerEmailError = formik.touched.ownerEmail && formik.errors.ownerEmail;
	return (
		<div className="flex w-full max-w-lg flex-col items-center gap-8">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-3xl font-bold text-slate-800">
					Entrar em um espaco existente
				</h1>
				<h2 className="text-slate-500">
					Solicite para uma administrador do espaco
				</h2>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className="flex w-full flex-col gap-5 p-8 md:rounded-xl md:bg-white md:shadow-lg"
			>
				<div className="flex w-full flex-col gap-2">
					<TextInput
						label="Email do administrador"
						id="ownerEmail"
						name="ownerEmail"
						value={formik.values.ownerEmail}
						placeholder="Email"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={ownerEmailError}
					/>
				</div>
				<button className="btn btn-primary w-full" type="submit">
					Solicitar acesso
				</button>
				<div className="divider">OU</div>
				<button
					onClick={createSpace}
					className="btn btn-primary btn-outline w-full"
					type="button"
				>
					Criar espaço
				</button>
			</form>
		</div>
	);
}
