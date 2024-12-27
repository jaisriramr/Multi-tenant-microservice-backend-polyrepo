import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsOptional()
  org_id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  picture: string;

  @IsNotEmpty()
  sub: string;
}
