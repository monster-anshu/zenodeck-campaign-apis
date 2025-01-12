import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { CAMPAIGN_APP_API_KEY } from '~/env';

@Injectable()
export class InternalGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as FastifyRequest;
    if (request.headers['x-api-key'] != CAMPAIGN_APP_API_KEY) {
      throw new HttpException('Forbidden', 401);
    }
    return true;
  }
}
