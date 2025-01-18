import { AgentDetails, CompanyPlan } from '~/agent/agent.service';
import { Session, SetSessionType } from '~/session/session.decorator';
import { CampaignApp } from './mongo/campaign';

export declare global {
  namespace Express {
    export interface Request {
      userInfo?: AgentDetails;
      appInfo?: CampaignApp;
      companyPlan?: CompanyPlan;
      session: Session | null;
      setSession: SetSessionType;
    }
  }
}
