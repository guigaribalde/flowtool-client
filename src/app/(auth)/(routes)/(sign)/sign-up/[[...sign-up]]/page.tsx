/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSignUp, useClerk, useSession } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
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
	username: Yup.string()
		.min(3, 'Seu nome de usuário deve ter no mínimo 3 caracteres')
		.required('Nome de usuário obrigatório'),
	password: Yup.string()
		.min(8, 'Sua senha deve ter no mínimo 8 caracteres')
		.required('Senha requerida'),
});

export default function Page() {
	const { isLoaded, signUp } = useSignUp();
	const { isSignedIn, isLoaded: isSessionLoaded } = useSession();
	const { signOut, isReady } = useClerk();

	const router = useRouter();
	const searchParams = useSearchParams();
	const invite = searchParams.get('invite');

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			username: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			if (!isLoaded) {
				return;
			}
			try {
				await signUp.create({
					emailAddress: values.email,
					password: values.password,
					username: values.username,
				});
				await signUp.prepareEmailAddressVerification({
					strategy: 'email_code',
				});

				router.push(`/sign-up/verify?invite=${invite}`);
			} catch (err: any) {
				const errorResponse = err as ErrorResponse;
				if (!errorResponse.clerkError) throw new Error('Erro desconhecido');
				errorResponse.errors.forEach((error: Error) => {
					switch (error.code) {
						case 'form_identifier_exists':
							return formik.setFieldError('email', 'Email já cadastrado');
						case 'form_password_pwned':
							return formik.setFieldError('password', 'Senha muito fraca');
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
					Registre-se
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
						placeholder="Seu nome de usuário"
						name="username"
						type="text"
						label="Nome de usuário"
					/>
					<TextInput
						formik={formik}
						placeholder="Seu email"
						name="email"
						type="email"
						label="Email"
					/>

					<PasswordInput
						formik={formik}
						placeholder="Sua senha"
						label="Senha"
						name="password"
					/>
				</div>
				<SubmitButton formik={formik}>REGISTRAR-SE</SubmitButton>
				<div className="flex justify-center gap-1 text-slate-500">
					<span>Ja possui uma conta?</span>
					<Link href="/sign-in">
						<p className="text-primary">Entrar</p>
					</Link>
				</div>
			</form>
		</div>
	);
}
