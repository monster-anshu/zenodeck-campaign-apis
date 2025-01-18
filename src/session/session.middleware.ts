import type { RequestHandler } from 'express';
import { ROOT_DOMAIN, STAGE } from '~/env';
import signJwt from '~/lib/jwt/sign';
import verifyJwt from '~/lib/jwt/verify';
import { Session } from './session.decorator';

export const SessionMiddlewareFn: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.__session;
  console.log({ token });
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

  res.on('header', () => {
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
      });
    });
  });

  next();
};
