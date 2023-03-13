import { Request, Response } from 'express';
import { createUser, getUser } from '../db/user';
import { deleteSession, createSession, getSession } from '../db/session';

//login handler
export async function createSessionHandler(req: Request, res: Response) {
  if (req.cookies?.session) {
    return res.status(400).send({ message: 'User is already logged in' });
  }

  const { email, password } = req.body;

  try {
    const user = await getUser(email);

    if (!user || user.password !== password) {
      return res.status(403).send({ message: 'Invalid email or password' });
    }

    const session = await createSession(user);
    //set session token in cookie
    res.cookie('session', session.id, { httpOnly: true });

    //send back logged in user
    return res.send({
      data: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: 'There was a problem creating new Session' });
  }
}

//get session
export async function getSessionHandler(req: Request, res: Response) {
  if (!req.cookies?.session) {
    return res.send({ data: null });
  }

  try {
    const { session: sessionId } = req.cookies;

    const session = await getSession(Number(sessionId));

    if (!session) {
      return res.status(500).send({ message: "Couldn't find session" });
    }
    const user = await getUser(Number(session.userId));

    return res.send({
      data: { id: user?.id, name: user?.name, email: user?.email },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: 'Unknown error while retriving user' });
  }
}

//log out handler
export async function deleteSessionHandler(req: Request, res: Response) {
  const { session: sessionId } = req.cookies;

  try {
    await deleteSession(Number(sessionId));

    res.clearCookie('session');
    return res.send({ data: null });
  } catch (error) {
    res.status(500).send({ message: 'There was a problem logging out a user' });
  }
}

export async function createUserHandler(req: Request, res: Response) {
  //TODO: check for session instead of a user
  if (req.cookies?.session) {
    return res.status(400).send({ message: 'User is already logged in' });
  }

  const { email, password, name } = req.body;

  const userFromDb = await getUser(email);

  //if user tries to create account but user exists
  if (userFromDb) {
    return res
      .status(401)
      .send({ message: 'User with this email already exists' });
  }

  try {
    const newUser = await createUser(email, password, name);

    if (!newUser) {
      return res
        .status(500)
        .send({ message: 'There was a problem creating new user' });
    }

    const session = await createSession(newUser);

    if (!session) {
      return res
        .status(500)
        .send({ message: 'There was a problem creating new session' });
    }

    res.cookie('session', session.id);

    return res.send({
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: 'There was a problem creating new Session' });
  }
}
