import { IsNotEmpty, IsString } from 'class-validator';

export class PopulateDefaultDto {
  @IsString()
  userId!: string;

  @IsString()
  companyId!: string;

  @IsNotEmpty()
  @IsString()
  companyName!: string;
}
