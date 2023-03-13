import { User } from '@prisma/client';
import { prisma } from '.';

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
