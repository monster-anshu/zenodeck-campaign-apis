import { Injectable } from '@nestjs/common';
import { CampaignAppService } from '~/campaign-app/campaign-app.service';
import { CredentialService } from '~/credential/credential.service';
import { HistoryService } from '~/history/history.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly historyService: HistoryService,
    private readonly credentialService: CredentialService,
    private readonly campaignAppService: CampaignAppService
  ) {}

  async get(appId: string) {
    const [history, credentialCount, campaignApp] = await Promise.all([
      this.historyService.stats(appId),
      this.credentialService.count(appId),
      this.campaignAppService.getById(appId),
    ]);

    return {
      history,
      credential: {
        total: credentialCount,
      },
      appInfo: {
        storageUsed: campaignApp?.storageUsed,
      },
    };
  }
}
