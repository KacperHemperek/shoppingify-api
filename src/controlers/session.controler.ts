import { Request, Response } from 'express';
import { createSession, createUser, getUser, invalidateSession } from '../db';
import { signJWT } from '../utils/jtw.utils';

//login handler
export async function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await getUser(email);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  const session = await createSession(user);

  if (!session) {
    return res.status(500).send('There was a problem creating new Session');
  }

  //create access token

  const accessToken = signJWT(
    { email: user.email, name: user.name, id: session.id, userId: user.id },
    '5m'
  );
  const refreshToken = signJWT({ sessionId: session.id }, '2y');

  //set access token in cookie
  //set cookie to 5 mins
  res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 300000 });
  //set cookie to 2 year
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 6.312e10, // 2 years
  });

  //send back loged in user
  return res.send(session);
}

//get session
export function getSessionHandler(req: Request, res: Response) {
  //@ts-ignore
  return res.send(req.user);
}

//log out handler
export async function deleteSessionHandler(req: Request, res: Response) {
  //@ts-ignore
  const session = await invalidateSession(req.user.session);

  if (!session) {
    return res.status(500).send('There was a problem while loging out');
  }

  res.cookie('accessToken', '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    maxAge: 0,
  });

  return res.send(session);
}

export async function createUserHandler(req: Request, res: Response) {
  const { email, password, confirmPass, name } = req.body;

  //check if passwords are same
  if (confirmPass !== password) {
    return res.status(400).send('Passwords do not match');
  }

  const userFromDb = await getUser(email);

  //if user tries to create account but is already logged in
  if (userFromDb) {
    return res.status(403).send('User with this email already exists');
  }

  const newUser = await createUser(email, password, name);

  if (!newUser) {
    return res.status(500).send('There was a problem creating new user');
  }

  const session = await createSession(newUser);

  if (!session) {
    return res.status(500).send('There was a problem creating new session');
  }

  const accessToken = signJWT(
    {
      email,
      name,
      session: session.id,
    },
    '5m'
  );
  const refreshToken = signJWT({ sessionId: session.id }, '2y');

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 300000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 6.312e10, // 2 years
  });
  return res.send(session);
}
