import { Injectable } from '@nestjs/common';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { PopulateDefaultDto } from './dto/populate-default.dto';

@Injectable()
export class InternalService {
  async populateDefault(body: PopulateDefaultDto) {
    return { success: true };
  }

  async acceptInvite(body: AcceptInviteDto) {
    return { success: true };
  }
}
