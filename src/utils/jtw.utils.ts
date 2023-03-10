import jwt from 'jsonwebtoken';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQBhgZJ2QjPV7IF9IdroP3GIL64CyeM1Z0/k4AeCZxZMapNbcfQP
rQibVduoqLDnmIzNW4jgTCLb4af17KHjmrV87WPhPt7rUG2lCepofcXGee7pMIAD
/fVtBmVutBGqaUoHwYVNGC167r0KaEDDZ6tcVyUs0de18xNGkshXyRU/BEuoaZQ1
MeslXZAuFXtykhVImfsHXixu641+IEtgzxcETtWatNfKYN9yss9MhAuNkg/Jn0/N
MEWCy6KT5f2MGm0fMADViOB0pmXDCC6ouu7FbRr4/658uZia03EujCgdJBN6xDcj
1JR4S6DWos7Pe49Y3eAcpzUSgoW4D8PJ/H+PAgMBAAECggEABagYsReiHjT8RiAi
rPqRQY9SjwLbVYvKzMJabSxB1OkR52oy+H3XU/ulJKG0sZreAEPhKvH/y7XJorC5
q5ScFsVG2BhnoksmMT7kBG/Xe24zd//CTXj8Nfj7BXMY20QEcXK+ovxWFx2mheYK
a8ul21OK6pC57OpPIfb9/GnD+8XXVaT5ZYqbWnnwmKOIECuYPJMoZY98jjYUvHUp
ah/Qu0MzX1QOUc2HUHR6t8VHy/8iU+w/2x4MNkA0toL7XSe2z3FavJJgNHzNbS/n
XHvt6IYXGDZaRP3fWYh6A0cw8R2NHLmfpYqhAVCJaT6rGtXJhW4O59XbpWFup+qB
+/+T8QKBgQDAYSS4sBBzFNGOiDvC6+00iPEwxD5Y01UPixxqj38pYEbuIS6uT6iw
mmwZTRrfaEKv2ks5vsMOoiMAQ/69CII+tnnPMrXclIl0v40pCzD2UDz+TSfjfugg
izHlqEO5HUC3iO7yyboR4p4trQtv+udk/QzHjxDfTfVuZquIFgjHmwKBgQCBwHKS
5n52gqgUU9SOZUUaX9Fkz3RBHI4UM0H3wkgPXow887RgTEUaYG/5ctHWRwxshbYj
S9c93C/GFb+Ir47BylVbYy/h4alE6UQKkmjQ+FpJw5TU3cIYFZFqacmQPc0fuvl3
lMyi6Icn5h5IPWxqPjf1RxsEE6mAziYGNNtZHQKBgQC+aCexSEmvrX5PxVTo8xve
sF+QNdvDjL+W18fzTD2+1RS/IkaSrjM3QFAXprIfRpEifjuQVte2hxF/dM0Pifln
WrIrOnS3cqitzd1IL1Rxpi8IP5NoXjYf58UmGimVcXeZcEWYNcMdap/Gc4xrc/lM
gg0BAv/fFMkDUUkbMzvTWwKBgHy+J6jhno2TWcKJQd5QsFoF6stPw4XhzRrQmMh4
6UyVaqAi8LRwPzN3qc+ZuvGWRvSCrLRMcrgPW4LGX+kqV0Yqn1uIBX3VtSYCWZ8M
WWcmja9DMHBibvs2qSI0aEubjvzFhpeX4BFzGpWaYFy1aOjPvn66iNeni5vBFb97
y7JlAoGATFSmIvY4RjxOX+ImO5mWSFyn+wuxhU6z+fEGvnW9fidVO8EAWpGWvPVL
blE5FoIY77L5PVPYmMFPzraA/CBa6EFjPbKlh/DpTMHOV7iksf3hA6hbhwT0uuBB
4tuvoCXxzUx5obB1hAT4EkSgXJqimmoDdX5JqBD2PyeCo5bog7c=
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBhgZJ2QjPV7IF9IdroP3GI
L64CyeM1Z0/k4AeCZxZMapNbcfQPrQibVduoqLDnmIzNW4jgTCLb4af17KHjmrV8
7WPhPt7rUG2lCepofcXGee7pMIAD/fVtBmVutBGqaUoHwYVNGC167r0KaEDDZ6tc
VyUs0de18xNGkshXyRU/BEuoaZQ1MeslXZAuFXtykhVImfsHXixu641+IEtgzxcE
TtWatNfKYN9yss9MhAuNkg/Jn0/NMEWCy6KT5f2MGm0fMADViOB0pmXDCC6ouu7F
bRr4/658uZia03EujCgdJBN6xDcj1JR4S6DWos7Pe49Y3eAcpzUSgoW4D8PJ/H+P
AgMBAAE=
-----END PUBLIC KEY-----`;

//sign jwt
export function signJWT(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn });
}

//verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error: any) {
    return {
      payload: null,
      expired: error.message,
    };
  }
}
