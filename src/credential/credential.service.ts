import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CredentialModel } from '~/mongo/campaign';
import { AddCredentialDto } from './dto/add-credential.dto';

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
}
