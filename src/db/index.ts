import { PrismaClient, User } from '@prisma/client';

export const prisma = new PrismaClient();

const users = [
  {
    email: 'test@test.com',
    password: 'password',
    name: 'Jane Doe',
  },
];

export const sessions: Record<
  string,
  { sessionId: string; email: string; valid: boolean; name: string }
> = {};

export async function getSession(sessionId: number) {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
    });

    return session && session.valid ? session : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function invalidateSession(sessionId: number) {
  try {
    const session = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        valid: false,
      },
      select: {
        email: true,
        name: true,
        id: true,
        userId: true,
        valid: true,
      },
    });

    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createSession(user: User) {
  try {
    const newSession = prisma.session.create({
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        valid: true,
      },
    });

    return newSession;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUser(email: string) {
  return await prisma.user.findFirst({ where: { email } });
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
    return null;
  }
}
