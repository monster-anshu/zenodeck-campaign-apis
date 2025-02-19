import { Agent } from './agent.schema';
import { Role } from './role.schema';

export * from './agent.schema';
export * from './campaign-app.schema';
export * from './campaign.schema';
export * from './credential.schema';
export * from './event.schema';
export * from './file.schema';
export * from './history.schema';
export * from './lead.schema';
export * from './list-list.schema';
export * from './role.schema';

export interface AgentDetails extends Agent {
  emailId?: string;
  mobileNo?: string;
  countryCode?: string;
  role?: Role | null;
  teamIds?: string[];
  name: string;
}
