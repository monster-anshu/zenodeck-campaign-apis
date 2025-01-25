import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AgentDetails } from '~/mongo/campaign';
import { GetAgentInfo, GetSession } from '~/session/session.decorator';
import { AgentGuard } from './agent.guard';

@UseGuards(AgentGuard)
@Controller('agent')
export class AgentController {
  @Get('info')
  async get(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetSession('companyId') companyId: string,
    // @GetCompanyPlan() companyPlan: CompanyPlan,
    @Req() req: Request,
    @GetAgentInfo() agentInfo: AgentDetails
  ) {
    const appInfo = req.appInfo;
    if (!appInfo) {
      throw new UnauthorizedException('Forbidden');
    }
    delete (appInfo as Record<string, unknown>).encryption;
    return {
      isSuccess: true,
      appInfo,
      agentInfo,
      //   planInfo: companyPlan,
      //   country: req.headers['cloudfront-viewer-country-name'] || '',
      //   countryCode: req.headers['cloudfront-viewer-country'] || '',
    };
  }
}
