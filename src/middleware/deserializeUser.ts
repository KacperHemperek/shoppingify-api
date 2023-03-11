import { NextFunction, Request, Response } from 'express';
import { signJWT, verifyJWT } from '../utils/jtw.utils';
import { set } from 'lodash';
import { getSession } from '../db';

export function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  //valid access token
  if (payload) {
    set(req, 'user', payload);

    return next();
  }

  //expired access token but valid access token
  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }
  //@ts-ignore
  const session = await getSession(refresh.sessionId);

  if (!session) {
    return next();
  }

  const newAccessToken = signJWT(session, '5m');

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    maxAge: 300000,
  });

  set(req, 'user', verifyJWT(newAccessToken).payload);

  return next();
}
