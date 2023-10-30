'use client';

import MultipleItemTextField from '@/components/MultipleItemTextField';
import TextInput from '@/components/TextInput';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	spaceName: Yup.string().required('Nome do espaco e obrigatorio'),
});

export default function Page() {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			spaceName: '',
			guests: [],
		},
		validationSchema,
		onSubmit: async (values) => {
			console.log(values);
			const payload = {
				spaceName: values.spaceName,
				guests: values.guests,
			};
			try {
				const response = await fetch('/api/complete-signup', {
					method: 'POST',
					body: JSON.stringify(payload),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await response.json();
				console.log({ data });
				if (data?.users.length > 0) {
					if (data.users.length === 1) {
						formik.setErrors({
							guests: `Email ${data.users[0]} ja esta em uso`,
						});
					} else {
						const emails = data.users.join(', ');
						formik.setErrors({
							guests: `Emails ${emails} ja estao em uso`,
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		},
	});

	const spaceNameError = formik.touched.spaceName && formik.errors.spaceName;
	const guestsError = formik.touched.guests && formik.errors.guests;

	const joinSpace = () => {
		return router.push('/app/setup/join-space');
	};

	return (
		<div className="flex w-full max-w-lg flex-col items-center gap-8">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-3xl font-bold text-slate-800">
					Termine de configurar sua conta
				</h1>
				<h2 className="text-slate-500">
					Entre em um espaco para comecar a usar
				</h2>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className="flex w-full flex-col gap-5 p-8 md:rounded-xl md:bg-white md:shadow-lg"
			>
				<div className="flex w-full flex-col gap-2">
					<TextInput
						label="Nome do espaço"
						id="spaceName"
						name="spaceName"
						value={formik.values.spaceName}
						placeholder="Nome"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={spaceNameError}
					/>
					<MultipleItemTextField
						label="Convidar pessoas"
						name="guests"
						placeholder="Email"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.guests}
						error={guestsError}
					/>
				</div>
				<button
					disabled={formik.isSubmitting || formik.isValidating}
					className="btn btn-primary w-full"
					type="submit"
				>
					{formik.isSubmitting || formik.isValidating ? (
						<span className="loading loading-spinner" />
					) : (
						''
					)}
					Criar espaço
				</button>
				<div className="divider">OU</div>
				<button
					onClick={joinSpace}
					className="btn btn-primary btn-outline w-full"
					type="button"
				>
					Entre em um espaço existente
				</button>
			</form>
		</div>
	);
}
