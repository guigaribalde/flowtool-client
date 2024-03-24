'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSignIn, useClerk, useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import TextInput from '@components/core/text-field';
import PasswordInput from '@components/core/password-field';
import SubmitButton from '@components/core/submit-button';

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

const validationSchema = Yup.object({
	email: Yup.string().email('Email invalido').required('Email obrigatório'),
	password: Yup.string().required('Senha requerida'),
});

export default function Page() {
	const { isLoaded, signIn, setActive } = useSignIn();
	const { isSignedIn, isLoaded: isSessionLoaded } = useSession();
	const { signOut, isReady } = useClerk();
	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			if (!isLoaded) {
				return;
			}

			try {
				const result = await signIn.create({
					identifier: values.email,
					password: values.password,
				});

				if (result.status === 'complete') {
					await setActive({ session: result.createdSessionId });
					router.push('/h/spaces');
				}
			} catch (err: any) {
				console.log(JSON.stringify(err, null, 2));

				const errorResponse = err as ErrorResponse;
				if (!errorResponse.clerkError) throw new Error('Erro desconhecido');
				errorResponse.errors.forEach((error: Error) => {
					switch (error.code) {
						case 'form_identifier_not_found':
							return formik.setFieldError('email', 'Email não cadastrado');
						case 'form_password_incorrect':
							return formik.setFieldError('password', 'Senha incorreta');
						default:
							return 'Erro desconhecido';
					}
				});
			}
		},
	});

	useEffect(() => {
		if (isSignedIn) {
			signOut();
		}
	}, [isSessionLoaded, isReady]);

	return (
		<div className="flex w-full max-w-lg flex-col items-center gap-8">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-3xl font-bold text-slate-800">
					Entre na sua conta
				</h1>
				<h2 className="text-slate-500">Para utilizar nossa plataforma</h2>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className="flex w-full flex-col gap-5 p-8 md:rounded-xl md:bg-white md:shadow-lg"
			>
				<div className="flex w-full flex-col gap-2">
					<TextInput
						formik={formik}
						label="Email"
						placeholder="Seu email"
						name="email"
						type="email"
					/>
					<PasswordInput
						formik={formik}
						label="Senha"
						placeholder="Sua senha"
						name="password"
					/>
				</div>
				<SubmitButton formik={formik}>ENTRAR</SubmitButton>
				<div className="flex justify-center gap-1 text-slate-500">
					<span>Não tem uma conta?</span>
					<Link href="/sign-up">
						<p className="text-primary">Cadastre-se</p>
					</Link>
				</div>
			</form>
		</div>
	);
}
