import { Request, Response } from 'express';
import { createSession, createUser, getUser, invalidateSession } from '../db';
import { signJWT } from '../utils/jtw.utils';

//login handler
export function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  //TODO: change to use database instead of a mock
  const user = getUser(email);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  const session = createSession(email, user.name);

  //create access token

  const accessToken = signJWT(
    { email: user.email, name: user.name, session: session.sessionId },
    '5m'
  );
  const refreshToken = signJWT({ sessionId: session.sessionId }, '2y');

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
export function deleteSessionHandler(req: Request, res: Response) {
  //@ts-ignore
  console.log({ user: req.user });

  //@ts-ignore
  const session = invalidateSession(req.user.session);

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

export function createUserHandler(req: Request, res: Response) {
  const { email, password, confirmPass, name } = req.body;

  console.log({ email });
  //check if passwords are same
  if (confirmPass !== password) {
    return res.status(400).send('Passwords do not match');
  }

  const userFromDb = getUser(email);

  //if user tries to create account but is already logged in
  if (userFromDb) {
    return res.status(403).send('User with this email already exists');
  }

  createUser(email, password, name);

  const session = createSession(email, name);

  const accessToken = signJWT(
    {
      email,
      name,
      session: session.sessionId,
    },
    '5m'
  );
  const refreshToken = signJWT({ sessionId: session.sessionId }, '2y');

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
