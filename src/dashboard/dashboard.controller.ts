import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { DashboardService } from './dashboard.service';

@UseGuards(AgentGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async get(@GetSession('appId') appId: string) {
    const res = await this.dashboardService.get(appId);
    return {
      ...res,
      isSuccess: true,
    };
  }
}
