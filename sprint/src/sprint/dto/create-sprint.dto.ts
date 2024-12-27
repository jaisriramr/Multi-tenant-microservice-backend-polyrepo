import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSprintDto {
  @IsNotEmpty()
  org_id: string;

  @IsNotEmpty()
  project_id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  sprint_goal: string;

  @IsOptional()
  tasks: [];

  @IsNotEmpty()
  created_by: Types.ObjectId;

  @IsNotEmpty()
  updated_by: Types.ObjectId;

  @IsNotEmpty()
  start_date: string;

  @IsNotEmpty()
  end_date: string;
}
