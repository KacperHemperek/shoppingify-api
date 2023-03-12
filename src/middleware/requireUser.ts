import { Request, Response, NextFunction } from 'express';

export function requireUser(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  if (!req.user) {
    return res.status(403).send({ message: 'Invalid session' });
  }

  return next();
}
