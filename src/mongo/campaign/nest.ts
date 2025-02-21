import {
  AgentModel,
  AgentSchemaName,
  CampaignAppModel,
  CampaignAppSchemaName,
  CampaignModel,
  CampaignSchemaName,
  CredentialModel,
  CredentialSchemaName,
  EmailEvent,
  EmailEventSchemaName,
  EmailLinkClickEventModel,
  EmailOpenEventModel,
  HistoryModel,
  HistorySchemaName,
  LeadListModel,
  LeadListSchemaName,
  LeadModel,
  LeadSchemaName,
  RoleModel,
  RoleSchemaName,
} from './index';

export const AgentModelProvider = {
  provide: AgentSchemaName,
  useValue: AgentModel,
};

export const CampaignAppModelProvider = {
  provide: CampaignAppSchemaName,
  useValue: CampaignAppModel,
};

export const CampaignModelProvider = {
  provide: CampaignSchemaName,
  useValue: CampaignModel,
};

export const CredentialModelProvider = {
  provide: CredentialSchemaName,
  useValue: CredentialModel,
};

export const EmailLinkClickModelProvider = {
  provide: EmailEventSchemaName + '.' + EmailEvent.CLICK,
  useValue: EmailLinkClickEventModel,
};

export const EmailOpenEventModelProvider = {
  provide: EmailEventSchemaName + '.' + EmailEvent.OPEN,
  useValue: EmailOpenEventModel,
};

export const HistoryModelProvider = {
  provide: HistorySchemaName,
  useValue: HistoryModel,
};

export const LeadModelProvider = {
  provide: LeadSchemaName,
  useValue: LeadModel,
};

export const LeadListModelProvider = {
  provide: LeadListSchemaName,
  useValue: LeadListModel,
};

export const RoleModelProvider = {
  provide: RoleSchemaName,
  useValue: RoleModel,
};

const MongoModelsProvider = [
  AgentModelProvider,
  CampaignAppModelProvider,
  CampaignModelProvider,
  CredentialModelProvider,
  HistoryModelProvider,
  LeadModelProvider,
  LeadListModelProvider,
  RoleModelProvider,
];
