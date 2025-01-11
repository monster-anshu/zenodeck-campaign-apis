import { Body, Controller, Post } from '@nestjs/common';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { PopulateDefaultDto } from './dto/populate-default.dto';
import { InternalService } from './internal.service';

@Controller('internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('populate-default')
  async populateDefault(@Body() body: PopulateDefaultDto) {
    const res = await this.internalService.populateDefault(body);
    return res;
  }

  @Post('accept-invite')
  async acceptInvite(body: AcceptInviteDto) {
    const res = await this.internalService.acceptInvite(body);
    return res;
  }
}
