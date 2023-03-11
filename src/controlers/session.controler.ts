import { Request, Response } from 'express';
import { createSession, getUser, invalidateSession } from '../db';
import { signJWT, verifyJWT } from '../utils/jtw.utils';

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
  const refreshToken = signJWT({ sessionId: session.sessionId }, '1y');

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

export function deleteSessionHandler(req: Request, res: Response) {
  res.cookie('accessToken', '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    maxAge: 0,
  });

  //@ts-ignore
  const session = invalidateSession(req.user.sessionId);

  return res.send(session);
}

//log out handler
