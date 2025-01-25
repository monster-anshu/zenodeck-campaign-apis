import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { CampaignApp } from '~/mongo/campaign';
import { GetCampaignApp, GetSession } from '~/session/session.decorator';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@UseGuards(AgentGuard)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async send(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetCampaignApp() campaignApp: CampaignApp,
    @Body() body: SendMailDto
  ) {
    const res = await this.mailService.send(appId, userId, body, campaignApp);
    return {
      isSuccess: true,
      res,
    };
  }
}
