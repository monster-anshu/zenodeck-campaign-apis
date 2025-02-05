import { Controller, Get, Query } from '@nestjs/common';
import { EmailHistoryModel } from '~/mongo/campaign';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('track')
  async track(
    @Query('emailId') emailId?: string,
    @Query('timestamp') timestamp?: string,
    @Query('trackId') trackId?: string
  ) {
    if (!trackId) {
      return;
    }

    await this.publicService.track(trackId);
  }
}
