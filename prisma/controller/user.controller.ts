import { type Prisma, type User } from '@prisma/client';
import prisma from '../prisma';

type UserBaseRequired = {
	email: string;
	clerkId: string;
	username: string;
} & Partial<User>;

const getUsers = async (): Promise<User[] | undefined> => {
	try {
		const users = await prisma.user.findMany({});
		await prisma.$disconnect();
		return users;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

const getUser = async (clerkId: string): Promise<User | undefined> => {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: { clerkId },
		});
		await prisma.$disconnect();
		return user;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

const createUserIfNotExists = async (
	user: UserBaseRequired,
): Promise<User | undefined> => {
	try {
		const newUser = await prisma.user.upsert({
			where: { clerkId: user.clerkId },
			update: user,
			create: user,
		});
		await prisma.$disconnect();
		return newUser;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

const createUser = async (
	user: UserBaseRequired,
): Promise<User | undefined> => {
	try {
		const newUser = await prisma.user.create({
			data: user,
		});
		await prisma.$disconnect();
		return newUser;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};
type UpdateData =
	| (Prisma.Without<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput> &
			Prisma.UserUncheckedUpdateInput)
	| (Prisma.Without<Prisma.UserUncheckedUpdateInput, Prisma.UserUpdateInput> &
			Prisma.UserUpdateInput);
const updateUser = async (
	clerkId: string,
	data: UpdateData,
): Promise<User | undefined> => {
	try {
		const updatedUser = await prisma.user.update({
			where: { clerkId },
			data,
		});
		await prisma.$disconnect();
		return updatedUser;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

const deleteUser = async (clerkId: string): Promise<User | undefined> => {
	try {
		const deletedUser = await prisma.user.delete({
			where: { clerkId },
		});
		await prisma.$disconnect();
		return deletedUser;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

export {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	createUserIfNotExists,
};
