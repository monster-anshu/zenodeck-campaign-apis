import { Inject, Injectable } from '@nestjs/common';
import { Agent, AgentDetails } from '~/mongo/campaign';
import { AgentModelProvider } from '~/mongo/campaign/nest';
import UserModel from '~/mongo/common/schema/User';
import { User } from '~/mongo/common/types';
import { RoleService } from '~/role/role.service';

@Injectable()
export class AgentService {
  static readonly AgentSelectFields = {
    _id: 1,
    appId: 1,
    countryCode: 1,
    dateFormat: 1,
    firstName: 1,
    holidayId: 1,
    language: 1,
    lastName: 1,
    profilePic: 1,
    roleId: 1,
    status: 1,
    timeFormat: 1,
    timezone: 1,
    userId: 1,
  };

  constructor(
    private readonly roleService: RoleService,
    @Inject(AgentModelProvider.provide)
    private agentModel: typeof AgentModelProvider.useValue
  ) {}

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
      return new this.agentModel({
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
    const createdAgents = await this.agentModel.insertMany(agents);
    return createdAgents || [];
  }

  async getAgentInfoWithRole({
    appId,
    userId,
    fetchRole = false,
    decrypted = false,
    isInvited = false,
  }: {
    appId: string;
    userId: string;
    fetchRole?: boolean;
    decrypted?: boolean;
    isInvited?: boolean;
  }): Promise<AgentDetails | null> {
    const [adminInfo, agentInfo] = await Promise.all([
      UserModel.findOne(
        {
          _id: userId,
          status: isInvited
            ? {
                $in: ['ACTIVE', 'UNVERIFIED'],
              }
            : 'ACTIVE',
        },
        {
          emailId: 1,
          firstName: 1,
          lastName: 1,
          mobileNo: 1,
          countryCode: 1,
        }
      ).lean(),
      this.agentModel
        .findOne({
          appId,
          userId,
          status: isInvited ? 'INVITED' : 'ACTIVE',
        })
        .select(AgentService.AgentSelectFields)
        .lean(),
    ]);

    if (!adminInfo || !agentInfo) {
      return null;
    }

    const userDet = this.format({
      adminInfo,
      agentInfo,
      decrypted,
    });

    const role = fetchRole
      ? await this.roleService.getById(appId, agentInfo.roleId.toString())
      : null;
    return { ...userDet, role };
  }

  private format({
    adminInfo,
    agentInfo,
    // decrypted = false,
  }: {
    adminInfo: User;
    agentInfo: Agent;
    decrypted?: boolean;
  }): AgentDetails {
    let firstName = adminInfo.firstName || '';
    let lastName = adminInfo.lastName || '';
    if (agentInfo.firstName || agentInfo.lastName) {
      firstName = agentInfo.firstName || '';
      lastName = agentInfo.lastName || '';
    }

    return {
      ...agentInfo,
      emailId: adminInfo.emailId,
      mobileNo: adminInfo.mobileNo,
      countryCode: agentInfo.countryCode || adminInfo.countryCode,
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(' '),
    };
  }
}

type CreateAgentPayload = {
  appId: string;
  userIds: string[];
  roleId: string;
  status?: 'ACTIVE' | 'INVITED';
};
