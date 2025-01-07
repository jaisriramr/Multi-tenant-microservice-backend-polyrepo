import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty()
  org_id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  sprints: [];

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  owner_id: Types.ObjectId;

  @IsNotEmpty()
  status: string;
}
