import { IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsString()
  userId!: string;

  @IsString()
  companyId!: string;
}
