/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useFormik } from 'formik';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import TextInput from '@components/forms/TextInput';

interface Error {
	code: string;
	message: string;
	longMessage: string;
	meta: {
		paramName: string;
	};
}
interface ErrorResponse {
	status: number;
	clerkError: boolean;
	errors: Error[];
}

export default function Page() {
	const { isLoaded, signUp, setActive } = useSignUp();
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			code: '',
		},
		onSubmit: async (values) => {
			if (!isLoaded) {
				return;
			}
			try {
				const completeSignUp = await signUp.attemptEmailAddressVerification({
					code: values.code,
				});
				if (completeSignUp.status !== 'complete') {
					console.log(JSON.stringify(completeSignUp, null, 2));
				}
				if (completeSignUp.status === 'complete') {
					await setActive({ session: completeSignUp.createdSessionId });
					router.push('/after-auth');
				}
			} catch (err: any) {
				// console.log(JSON.stringify(err, null, 2));

				const errorResponse = err as ErrorResponse;
				if (!errorResponse.clerkError) throw new Error('Erro desconhecido');
				errorResponse.errors.forEach((error: Error) => {
					switch (error.code) {
						case 'form_code_incorrect':
							return formik.setFieldError('code', 'Codigo incorreto');
						default:
							return 'Erro desconhecido';
					}
				});
			}
		},
	});

	const codeError = formik.touched.code && formik.errors.code;
	return (
		<div className="flex w-full max-w-lg flex-col items-center gap-8">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-3xl font-bold text-slate-800">
					Verificar email
				</h1>
				<h2 className="text-slate-500">Insira o codigo enviado por email</h2>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className="flex w-full flex-col gap-5 p-8 md:rounded-xl md:bg-white md:shadow-lg"
			>
				<TextInput
					label="Codigo"
					id="code"
					name="code"
					value={formik.values.code}
					placeholder="Seu codigo"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={codeError}
				/>
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
					VERIFICAR
				</button>
			</form>
		</div>
	);
}
