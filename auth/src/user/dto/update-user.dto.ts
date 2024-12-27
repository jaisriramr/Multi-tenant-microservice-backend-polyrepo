import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsOptional()
  org_id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  picture: string;

  @IsOptional()
  sub: string;
}
