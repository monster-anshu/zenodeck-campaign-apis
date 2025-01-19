import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AgentDetails } from '~/mongo/campaign';
import {
  GetAgentInfo,
  GetSession,
  SetSession,
} from '~/session/session.decorator';
import { AgentGuard } from './agent.guard';

@UseGuards(AgentGuard)
@Controller('agent')
export class AgentController {
  @Get('info')
  async get(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetSession('companyId') companyId: string,
    @SetSession() setSession: (key: string, value?: unknown) => void,
    // @GetCompanyPlan() companyPlan: CompanyPlan,
    @Req() req: Request,
    @GetAgentInfo() agentInfo: AgentDetails
  ) {
    const appInfo = req.appInfo;
    if (!appInfo) {
      throw new UnauthorizedException('Forbidden');
    }
    if (setSession) {
      setSession('bookingsApp', {
        appId,
        companyId,
      });
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
