import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  passwordHash: string;

  @IsNotEmpty()
  roles: Types.ObjectId[];

  @IsNotEmpty()
  status: string;
}
