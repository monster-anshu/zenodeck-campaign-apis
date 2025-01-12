import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PopulateDefaultDto } from './dto/populate-default.dto';
import { InternalGuard } from './internal.guard';
import { InternalService } from './internal.service';

@UseGuards(InternalGuard)
@Controller('internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('populate-default')
  async populateDefault(@Body() body: PopulateDefaultDto) {
    const res = await this.internalService.populateDefault(body);
    return res;
  }

  // @Post('accept-invite')
  // async acceptInvite(body: AcceptInviteDto) {
  //   const res = await this.internalService.acceptInvite(body);
  //   return res;
  // }
}
