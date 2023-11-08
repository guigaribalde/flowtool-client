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

type Props = {
	workspaceId: string;
};

const validationSchema = Yup.object({
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
});

export default function InviteMembers({ workspaceId }: Props) {
	const { toast } = useToast();
	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema,
		onSubmit: async (values, { resetForm }) => {
			const response = await fetch(`/api/workspace/${workspaceId}/invite`, {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const { message } = await response.json();

			switch (message) {
				case 'INVITED_USER':
					toast({
						title: 'Usuário convidado com sucesso',
						description: `O usuário ${values.email} foi convidado para a sua área de trabalho`,
					});
					resetForm();
					break;
				case 'ALREADY_INVITED_USER':
					formik.setFieldError('email', 'Este usuário já foi convidado');
					break;
				case 'UNAUTHORIZED':
					formik.setFieldError('email', 'Você não tem permissão para convidar');
					break;
				default:
					resetForm();
			}
		},
	});
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
					disabled={formik.isSubmitting || formik.isValidating}
				>
					{formik.isSubmitting || formik.isValidating ? (
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
