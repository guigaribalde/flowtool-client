/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import TextInput from '@/components/forms/TextInput';
import { PiPlus } from 'react-icons/pi';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WorkSpace } from '@prisma/client';
import Navbar from '@components/layout/ui/Navbar';
import Spaces from './_components/Spaces';
import Workspaces from './_components/Workspaces';
import useCurrentUser from '../_utils/hooks/useCurrentUser';
import { TUser } from '../_utils/context/CurrentUserContext';

export default function Layout({ children }: { children: React.ReactNode }) {
	const { user, setUser } = useCurrentUser();
	const workSpaces = user?.UserOnWorkSpace.map((uows) => uows.workSpace);
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

				console.log(workspace);

				setUser((old) => {
					const newState = {
						...old,
						UserOnWorkSpace: [
							...old.UserOnWorkSpace,
							{
								workSpace: {
									...workspace,
									Space: [],
								},
							},
						],
					} as TUser;
					return newState;
				});

				resetForm();
			} catch (error) {
				console.log(error);
			}
		},
	});
	const nameError = formik.errors.name && formik.touched.name;

	return (
		<>
			<Navbar username={user?.username} />
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
										label="Nome"
										type="name"
										name="name"
										placeholder="Nome da sua área de trabalho"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.name}
										error={nameError}
									/>
									<button
										className="btn btn-primary btn-sm w-full"
										type="button"
										disabled={formik.isSubmitting || formik.isValidating}
										onClick={() => formik.handleSubmit()}
									>
										{(formik.isSubmitting || formik.isValidating) && (
											<span className="loading loading-spinner" />
										)}
										Criar
									</button>
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
