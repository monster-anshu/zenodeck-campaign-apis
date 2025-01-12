import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Role, RoleModel } from '~/mongo/campaign';

@Injectable()
export class RoleService {
  async createDefault(appId: string, userId: string) {
    const data = await RoleModel.findOne({
      appId,
      isAutoCreated: true,
      isSuperAdminRole: true,
    }).lean();

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
      //   appId: new Types.ObjectId(appId),
      //   name: 'User',
      //   status: 'ACTIVE',
      //   permissions: {},
      //   isAutoCreated: true,
      //   createdBy: new Types.ObjectId(userId),
      //   modifiedBy: new Types.ObjectId(userId),
      // },
    ];
    let superAdminRole;
    for (const role of roles) {
      const document = await RoleModel.create(role);
      if (document.isSuperAdminRole) {
        superAdminRole = document;
      }
    }
    return superAdminRole!._id.toString();
  }
}
