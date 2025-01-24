import { Agent } from './agent.schema';
import { Role } from './role.schema';

export * from './agent.schema';
export * from './campaign-app.schema';
export * from './credential.schema';
export * from './role.schema';

export interface AgentDetails extends Agent {
  emailId?: string;
  mobileNo?: string;
  countryCode?: string;
  role?: Role | null;
  teamIds?: string[];
  name: string;
}
