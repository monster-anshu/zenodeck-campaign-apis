import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CampaignAppService } from '~/campaign-app/campaign-app.service';
import { ROOT_DOMAIN } from '~/env';
import CompanyUserPermissionModel from '~/mongo/common/schema/CompanyUserPermission';
import { AgentService } from './agent.service';

@Injectable()
export class AgentGuard implements CanActivate {
  constructor(
    private readonly campaignAppService: CampaignAppService,
    private readonly agentService: AgentService
  ) {}
  async canActivate(context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session;

    if (!session) {
      throw new UnauthorizedException();
    }

    const { userId, companyId: parentCompanyId, campaignApp } = session || {};
    let { appId, companyId } = campaignApp || {};
    companyId = companyId || parentCompanyId;

    if (userId && !companyId) {
      const userCompanies = await CompanyUserPermissionModel.find(
        {
          products: { $in: ['CAMPAIGN'] },
          userId,
          status: 'ACTIVE',
        },
        { companyId: 1 },
        {
          limit: 2,
        }
      ).lean();
      if (userCompanies?.length == 1) {
        companyId = userCompanies[0]?.companyId.toString();
        session.campaignApp = {
          companyId,
        };
      } else if (!userCompanies?.length) {
        response.header(
          'x-zenodeck-redirect',
          `${ROOT_DOMAIN}/fill-details?redirect=BOOKINGS`
        );
      } else {
        response.header(
          'x-orufy-redirect',
          `${ROOT_DOMAIN}/company-list?redirect=BOOKINGS`
        );
      }
    }
    if (!userId || !companyId) {
      throw new UnauthorizedException();
    }

    const [appInfo] = await Promise.all([
      this.campaignAppService.get({
        appId,
        companyId,
        projection: {
          encryption: 1,
        },
      }),
    ]);

    if (!appInfo) {
      throw new UnauthorizedException();
    }

    appId = appInfo._id.toString();
    session.campaignApp = {
      appId,
      companyId,
    };

    const userInfo = await this.agentService.getAgentInfoWithRole({
      appId,
      userId,
      fetchRole: true,
      decrypted: true,
    });

    if (!userInfo) {
      throw new UnauthorizedException();
    }
    request.userInfo = userInfo;
    request.appInfo = appInfo;
    return true;
  }
}
