'use client';

import { PiFolderFill, PiPlus } from 'react-icons/pi';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import TextInput from '@components/core/text-field';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { Space } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import SubmitButton from '@components/core/submit-button';
import { useAppMetadata } from '@/stores/app-metadata/app-metadata';

export default function Page() {
	const rawWorkspaces = useAppMetadata((state) => state.workspaces);
	const workspaces = useAppMetadata((state) => state.workspacesToArray());
	const spaces = useAppMetadata((state) => state.spacesToArray());
	const addSpace = useAppMetadata((state) => state.addSpace);

	const formik = useFormik({
		initialValues: {
			name: '',
			workspaceId: workspaces[0]?.id || '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required('Campo obrigatório'),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				const { data } = await axios.post('/api/space/create', values);
				const { space }: { space: Space } = data;
				addSpace(space);

				resetForm();
				toast({
					title: 'Espaco criado com sucesso',
					description: 'O espaco foi criado com sucesso',
				});
			} catch (e) {
				console.log(e);
				toast({
					title: 'Erro ao tentar criar espaco',
					description: 'Tente novamente mais tarde',
				});
			}
		},
	});

	return (
		<div className="flex w-full flex-col">
			<h1 className="text-xl font-semibold text-slate-700">Seus espacos</h1>
			<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{spaces.map(({ id, name, workSpaceId }) => (
					<Link href={`/space/${id}/board`} key={id}>
						<div className="h-24 w-full cursor-pointer rounded-lg bg-gradient-to-br from-cyan-300 to-cyan-500 p-3 transition-all duration-200 hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-100">
							<div className="flex w-full flex-col">
								<span className="flex items-center gap-2 text-xs text-slate-500 ">
									<PiFolderFill /> {rawWorkspaces[workSpaceId].name}
								</span>
								<span className="font-semibold text-slate-700">{name}</span>
							</div>
						</div>
					</Link>
				))}

				<Dialog>
					<DialogTrigger asChild>
						<div className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-200 p-3 transition-all duration-200 hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-100">
							<span className="flex items-center gap-2 text-sm">
								<PiPlus />
								<span>Criar novo espaco</span>
							</span>
						</div>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Criar novo espaco</DialogTitle>
							<DialogDescription>
								Crie um novo espaco dentro de uma area de trabalho inserindo o
								nome dele abaixo.
							</DialogDescription>
						</DialogHeader>
						<TextInput
							formik={formik}
							label="Nome"
							type="name"
							name="name"
							placeholder="Nome do seu espaco"
						/>
						<Select
							value={formik.values.workspaceId}
							onValueChange={(value) => {
								formik.setFieldValue('workspaceId', value);
							}}
						>
							<div className="flex w-full flex-col">
								<span className="px-1 py-2 text-sm">Area de Trabalho</span>
								<SelectTrigger className="h-12 w-full rounded-lg border-gray-300">
									<SelectValue placeholder="Area de trabalho" />
								</SelectTrigger>
							</div>
							<SelectContent side="top">
								{workspaces.map(({ id, name }) => (
									<SelectItem key={id} value={id}>
										{name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

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
		</div>
	);
}
