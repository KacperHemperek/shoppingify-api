import { prisma } from '.';

export async function getUser(q: number | string) {
  const where = typeof q === 'string' ? { email: q } : { id: q };

  return await prisma.user.findFirst({ where });
}

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const user = { email, name, password };

  try {
    const newUser = await prisma.user.create({
      data: user,
    });
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error('Creating user failed');
  }
}
