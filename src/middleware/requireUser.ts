import { Request, Response, NextFunction } from 'express';

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.session) {
    return res
      .status(403)
      .send({ message: 'This endpoint requires authentication' });
  }

  return next();
}
