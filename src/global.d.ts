import 'fastify';
import { Session, SetSessionType } from '~/session/session.decorator';
import { AgentDetails, CampaignApp } from './mongo/campaign';

// export declare global {
//   namespace Express {
//     export interface Request {
//       userInfo?: AgentDetails;
//       appInfo?: CampaignApp;
//       companyPlan?: CompanyPlan;
//       session: Session | null;
//       setSession: SetSessionType;
//     }
//   }
// }

declare module 'fastify' {
  interface FastifyRequest {
    userInfo?: AgentDetails;
    appInfo?: CampaignApp;
    companyPlan?: CompanyPlan;
    session: Session | null;
    setSession: SetSessionType;
  }
}
