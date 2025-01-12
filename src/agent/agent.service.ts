import { Injectable } from '@nestjs/common';
import { AgentModel } from '~/mongo/campaign';
import UserModel from '~/mongo/common/schema/User';

@Injectable()
export class AgentService {
  async createAgents({
    appId,
    userIds,
    roleId,
    status = 'ACTIVE',
  }: CreateAgentPayload) {
    const users = await UserModel.find({
      _id: {
        $in: userIds,
      },
    }).lean();
    const agents = users.map((user) => {
      return new AgentModel({
        appId: appId,
        roleId: roleId,
        userId: user._id,
        status,
        invitedAt: new Date(),
        firstName: user.firstName,
        lastName: user.lastName,
        countryCode: user.countryCode,
        timezone: user.timezone,
      });
    });
    const createdAgents = await AgentModel.insertMany(agents);
    return createdAgents || [];
  }
}

type CreateAgentPayload = {
  appId: string;
  userIds: string[];
  roleId: string;
  status?: 'ACTIVE' | 'INVITED';
};
