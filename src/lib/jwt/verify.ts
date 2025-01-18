import { verify } from 'jsonwebtoken';
import { SESSION_JWT_SECRET } from '~/env';
import { Session } from '~/session/session.decorator';

if (!SESSION_JWT_SECRET) {
  throw new Error('SESSION_JWT_SECRET is not defined');
}

const verifyJwt = (token: string): Promise<Session | null> => {
  return new Promise((resolve) => {
    if (!token) {
      return resolve(null);
    }
    verify(token, SESSION_JWT_SECRET, (_err, decoded) => {
      if (typeof decoded !== 'object' || !('data' in decoded)) {
        return resolve(null);
      }
      resolve((decoded?.data as Session) || null);
    });
  });
};

export default verifyJwt;
