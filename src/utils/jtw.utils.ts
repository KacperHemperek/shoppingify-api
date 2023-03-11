import jwt from 'jsonwebtoken';

const privateKey = ``;

const publicKey = ``;

//sign jwt
export function signJWT(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, process.env.PRIVATE_KEY!, {
    algorithm: 'RS256',
    expiresIn,
  });
}

//verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY!);
    return { payload: decoded, expired: false };
  } catch (error: any) {
    return {
      payload: null,
      expired: error.message,
    };
  }
}
