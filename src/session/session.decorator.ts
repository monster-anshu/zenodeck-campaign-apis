import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AgentDetails, CampaignApp } from '~/mongo/campaign';

export type SetSessionType = <Key extends keyof Session>(
  key: Key,
  value?: Session[Key]
) => void;

export type Session = {
  userId?: string;
  companyId?: string;
  campaignApp: {
    appId?: string;
    companyId?: string;
  };
};

export const GetSession = createParamDecorator(
  (key: keyof Session | 'appId', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (key === 'appId') {
      return request.appInfo?._id?.toString();
    }
    if (key === 'companyId') {
      return request.appInfo?.companyId?.toString();
    }
    if (key === 'userId') {
      return request.userInfo?.userId?.toString();
    }
    return request.session?.[key];
  }
);

export const GetAgentInfo = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<AgentDetails> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.userInfo!;
  }
);

export const GetCampaignApp = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<CampaignApp> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.appInfo!;
  }
);

export const SetSession = createParamDecorator(
  (_, ctx: ExecutionContext): SetSessionType => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (key, value) => {
      if (!req.session) return;
      //0 is allowed value
      if (typeof value === 'undefined') {
        delete req.session?.[key];
        return;
      }
      req.session[key] = value;
    };
  }
);

export const GetCompanyPlan = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.companyPlan;
  }
);
