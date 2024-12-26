import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateSprintDto {
  @IsNotEmpty()
  _id: Types.ObjectId;

  @IsOptional()
  project_id: Types.ObjectId;

  @IsOptional()
  name: string;

  @IsOptional()
  sprint_goal: string;

  @IsOptional()
  tasks: [];

  @IsNotEmpty()
  updated_by: Types.ObjectId;

  @IsOptional()
  start_date: string;

  @IsOptional()
  end_date: string;
}
