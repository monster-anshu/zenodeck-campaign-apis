import type { FastifyReply, FastifyRequest } from 'fastify';
import { ROOT_DOMAIN, STAGE } from '~/env';
import signJwt from '~/lib/jwt/sign';
import verifyJwt from '~/lib/jwt/verify';
import { Session } from './session.decorator';

export const onHeader = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.session) {
    return;
  }

  const jwt = signJwt(req.session as Session);
  const cookieDomains = [ROOT_DOMAIN.replace(/^https?:\/\/(www\.)?/, '')];
  if (!['prod'].includes(STAGE)) {
    cookieDomains.push('localhost');
  }
  cookieDomains.forEach((cookieDomain) => {
    res.cookie('__session', jwt, {
      maxAge: 90 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      domain: cookieDomain,
      path: '/',
    });
  });
};

export const SessionMiddlewareFn = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const token = req.cookies?.__session;

  if (!token) {
    return;
  }

  const decoded = await verifyJwt(token);
  req.session = decoded;
  req.setSession = (key, value) => {
    if (!req.session) return;
    if (!value) {
      delete req.session?.[key];
      return;
    }
    req.session[key] = value;
  };
};
