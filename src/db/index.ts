import { PrismaClient } from '@prisma/client';

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

export function getSession(sessionId: string) {
  const session = sessions[sessionId];

  return session && session.valid ? session : null;
}

export function invalidateSession(sessionId: string) {
  const session = sessions[sessionId];

  if (session) {
    sessions[sessionId].valid = false;
  }

  return sessions[sessionId];
}

export function createSession(email: string, name: string) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, email, name, valid: true };

  sessions[sessionId] = session;

  return session;
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
      data: {
        email,
        name,
        password,
      },
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}
