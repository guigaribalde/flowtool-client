'use client';

import {
	// PiLinkBold,
	PiUserPlusBold,
} from 'react-icons/pi';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import TextInput from '@/components/forms/TextInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useToast } from '@components/ui/use-toast';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import useUsers from '../../_utils/hooks/useUsers';

const validationSchema = Yup.object({
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
});

export default function InviteMembers() {
	const { toast } = useToast();
	const { inviteMembersMutation } = useUsers();

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema,
		onSubmit: async (values) => inviteMembersMutation.mutate(values),
	});

	useEffect(() => {
		const { isSuccess, isError, error, reset } = inviteMembersMutation;

		if (isSuccess) {
			toast({
				title: 'Usuário convidado com sucesso',
				description: `O usuário ${formik.values.email} foi convidado para a sua área de trabalho`,
			});
			reset();
			formik.resetForm();
		}

		if (isError) {
			const axiosError = error as AxiosError<{
				message: 'ALREADY_INVITED_USER' | 'UNAUTHORIZED';
			}>;

			if (!axiosError?.response)
				return console.log('axiosError?.response is undefined');
			if (!axiosError?.response?.data)
				return console.log('axiosError?.response?.data is undefined');

			const { message } = axiosError!.response!.data;

			switch (message) {
				case 'ALREADY_INVITED_USER':
					formik.setFieldError('email', 'Este usuário já foi convidado');
					break;
				case 'UNAUTHORIZED':
					formik.setFieldError('email', 'Você não tem permissão para convidar');
					break;
				default:
					toast({
						title: 'Erro ao convidar usuário',
						description: 'Tente novamente mais tarde',
					});
			}
			reset();
		}

		return () => {};
	}, [inviteMembersMutation]);

	const emailError = formik.touched.email && formik.errors.email;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="btn btn-primary btn-sm" type="button">
					<PiUserPlusBold />
					<span>Convidar membros</span>
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Convidar Membro</DialogTitle>
					<DialogDescription>
						Convide membros para a sua Area de Trabalho para que eles possam
						acessar seus espaços de trabalho.
					</DialogDescription>
				</DialogHeader>
				<TextInput
					label="Email"
					type="email"
					name="email"
					placeholder="Endereço de email"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.email}
					error={emailError}
				/>
				<button
					className="btn btn-primary btn-sm w-full"
					type="button"
					onClick={() => formik.handleSubmit()}
					disabled={inviteMembersMutation.isPending}
				>
					{inviteMembersMutation.isPending ? (
						<span className="loading loading-spinner" />
					) : (
						''
					)}
					Convidar
				</button>
				{/* <div className="divider">ou</div> */}
				{/* <div className="flex w-full items-center justify-between"> */}
				{/* 	<DialogDescription>Ou envie um convite por link</DialogDescription> */}
				{/* 	<button className="btn btn-primary btn-sm" type="button"> */}
				{/* 		<PiLinkBold /> */}
				{/* 		Criar link */}
				{/* 	</button> */}
				{/* </div> */}
			</DialogContent>
		</Dialog>
	);
}
