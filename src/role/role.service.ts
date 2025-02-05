import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleSchemaName, ConnectionName.DEFAULT)
    private roleModel: Model<Role>
  ) {}

  async createDefault(appId: string, userId: string) {
    const data = await this.roleModel
      .findOne({
        appId,
        isAutoCreated: true,
        isSuperAdminRole: true,
      })
      .lean();

    if (data?._id) {
      return data._id.toString();
    }

    const roles: Omit<Role, 'createdAt' | 'updatedAt'>[] = [
      {
        appId: new Types.ObjectId(appId),
        name: 'Admin',
        status: 'ACTIVE',
        permissions: {},
        isSuperAdminRole: true,
        isAutoCreated: true,
        createdBy: new Types.ObjectId(userId),
        modifiedBy: new Types.ObjectId(userId),
      },
      // {
      //   appId: ObjectId(appId),
      //   name: 'User',
      //   status: 'ACTIVE',
      //   permissions: {},
      //   isAutoCreated: true,
      //   createdBy: ObjectId(userId),
      //   modifiedBy: ObjectId(userId),
      // },
    ];
    let superAdminRole;
    for (const role of roles) {
      const document = await this.roleModel.create(role);
      if (document.isSuperAdminRole) {
        superAdminRole = document;
      }
    }
    return superAdminRole!._id.toString();
  }

  async getById(appId: string, roleId: string) {
    const role = await this.roleModel
      .findOne({
        _id: roleId,
        appId: appId,
      })
      .lean();

    return role;
  }
}
