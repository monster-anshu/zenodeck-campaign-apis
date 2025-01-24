import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Credential, CredentialModel } from '~/mongo/campaign';
import { AddCredentialDto } from './dto/add-credential.dto';
import { EditCredentialDto } from './dto/edit-credential.dto';

@Injectable()
export class CredentialService {
  async add(
    appId: string,
    userId: string,
    { privateKeys, type, name }: AddCredentialDto
  ) {
    const doc = await CredentialModel.create({
      appId: new Types.ObjectId(appId),
      createdBy: new Types.ObjectId(userId),
      name: name,
      privateKeys: privateKeys, // TODO: encrypt private keys using app specify encryption
      type: type,
    });
    const credential = doc.toObject();
    delete credential.privateKeys;
    return credential;
  }

  async edit(
    appId: string,
    userId: string,
    { id, name, privateKeys, type }: EditCredentialDto
  ) {
    const set: Partial<Credential> = {};

    if (name) {
      set.name = name;
    }

    if (privateKeys) {
      set.privateKeys = privateKeys; // TODO: encrypt with app specify enctryption
    }

    if (type) {
      set.type = type;
    }

    const credential = await CredentialModel.findOneAndUpdate(
      {
        appId: new Types.ObjectId(appId),
        id: new Types.ObjectId(id),
        status: 'ACTIVE',
      },
      {
        $set: set,
      },
      {
        new: true,
      }
    )
      .select('-privateKeys')
      .lean();

    return credential;
  }
}
