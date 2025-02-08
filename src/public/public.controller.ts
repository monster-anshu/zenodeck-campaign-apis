import { Controller, Get, Query, Req } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('track')
  async track(
    @Query('emailId') emailId?: string,
    @Query('trackId') trackId?: string
  ) {
    if (!trackId || !emailId) {
      return;
    }

    await this.publicService.track(trackId);
  }

  @Get('redirect')
  async redirect(
    @Req() res: FastifyReply,
    @Query('emailId') emailId?: string,
    @Query('trackId') trackId?: string,
    @Query('next') next?: string
  ) {
    if (!next) {
      return;
    }
    if (!trackId || !emailId) {
      res.redirect(next);
      return;
    }
    await this.publicService.ctr(trackId, next);
    res.redirect(next);
  }
}
