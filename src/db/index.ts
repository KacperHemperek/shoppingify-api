import { PrismaClient, User } from '@prisma/client';

export const prisma = new PrismaClient();

export async function getSession(sessionId: number) {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
    });

    return session;
  } catch (error) {
    console.error(error);
    throw new Error('Retrieving session from database failed');
  }
}

export async function deleteSession(sessionId: number) {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Deleting session failed');
  }
}

export async function createSession(user: User) {
  try {
    return await prisma.session.create({
      data: {
        userId: user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Creating session failed');
  }
}

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
