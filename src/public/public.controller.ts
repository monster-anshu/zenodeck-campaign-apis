import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
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
    @Res() res: FastifyReply,
    @Query('email') email?: string,
    @Query('trackId') trackId?: string,
    @Query('next') next?: string
  ) {
    debugger;
    if (!next) {
      return;
    }
    if (!trackId || !email) {
      res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(next);
      return;
    }
    await this.publicService.ctr(trackId, next);
    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(next);
  }
}
