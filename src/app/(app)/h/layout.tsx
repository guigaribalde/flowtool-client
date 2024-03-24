/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import TextInput from '@components/core/text-field';
import { PiPlus } from 'react-icons/pi';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WorkSpace } from '@prisma/client';
import Navbar from '@components/core/navbar';
import SubmitButton from '@components/core/submit-button';
import { useAppMetadata } from '@/stores/app-metadata/app-metadata';
import { toast } from '@components/ui/use-toast';
import Spaces from './_components/Spaces';
import Workspaces from './_components/Workspaces';

export default function Layout({ children }: { children: React.ReactNode }) {
	const workSpaces = useAppMetadata((state) => state.workspacesToArray());
	const user = useAppMetadata((state) => state.user);
	const addWorkspace = useAppMetadata((state) => state.addWorkspace);
	const formik = useFormik({
		initialValues: {
			name: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required('Campo obrigatório'),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				const { data } = await axios.post('/api/workspace/create', values);
				const { workspace }: { workspace: WorkSpace } = data;

				addWorkspace(workspace);

				resetForm();
				toast({
					title: 'Area de trabalho criada com sucesso',
					description: 'O espaco foi criado com sucesso',
				});
			} catch (e) {
				console.log(e);
				toast({
					title: 'Erro ao tentar criar Area de trabalho',
					description: 'Tente novamente mais tarde',
				});
			}
		},
	});

	return (
		<>
			<Navbar username={user.username} />
			<div className="mx-auto mt-5 flex w-full max-w-5xl gap-5 p-5">
				<div className="flex w-full max-w-[256px] flex-col gap-3">
					<div className="flex flex-col gap-1">
						<Spaces />
					</div>
					<hr />
					<div className="flex flex-col items-center gap-2">
						<div className="flex w-full items-center justify-between pl-3 text-xs font-semibold text-slate-700">
							<span>Áreas de trabalho</span>

							<Dialog>
								<DialogTrigger asChild>
									<button className="btn btn-ghost btn-sm" type="button">
										<PiPlus />
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Criar nova área de trabalho</DialogTitle>
										<DialogDescription>
											Crie uma nova área de trabalho inserindo o nome dele
											abaixo.
										</DialogDescription>
									</DialogHeader>
									<TextInput
										formik={formik}
										label="Nome"
										type="name"
										name="name"
										placeholder="Nome da sua área de trabalho"
									/>
									<SubmitButton
										onClick={() => formik.handleSubmit()}
										className="btn-sm"
										formik={formik}
									>
										Criar
									</SubmitButton>
								</DialogContent>
							</Dialog>
						</div>
						<div className="flex w-full">
							<Workspaces workspaces={workSpaces} />
						</div>
					</div>
				</div>
				{children}
			</div>
		</>
	);
}
