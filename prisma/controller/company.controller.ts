import { type Company } from '@prisma/client';
import prisma from '../prisma';

const createCompany = async (
	company: Omit<Company, 'id'>,
): Promise<Company | undefined> => {
	try {
		const newCompany = await prisma.company.create({
			data: company,
		});
		await prisma.$disconnect();
		return newCompany;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

// eslint-disable-next-line import/prefer-default-export
export { createCompany };
